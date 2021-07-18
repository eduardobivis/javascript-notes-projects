///////////////////////////////////////
// Imports
import { API_KEY, API_URL, RES_PER_PAGE } from './config'
import { getJSON, postJSON } from './helpers';

/*
    Operations:

        Load Recipe
        Search Recipe and Paginates it
        Update Servings
        Bookmarks a Recipe
        Update a new Recipe to the API
*/

///////////////////////////////////////
// State
export const state = {
    recipe: {},
    search: {
        query: '',
        page: 1,
        resultsPerPage: RES_PER_PAGE,
        results: {}
    },
    bookmark: []
};

///////////////////////////////////////
// Formats Recipe Data coming from the API
const formatRecipe = data => {
    const formattedRecipe = {
        id: data.id,
        title: data.title,
        publisher: data.publisher,
        sorceUrl: data.source_url,
        image: data.image_url,
        servings: data.servings,
        cookingTime: data.cooking_time,
        ingredients: data.ingredients
    };

    //If you created it the key is stored
    data.key && ( formattedRecipe.key = data.key );
    return formattedRecipe;
}

///////////////////////////////////////
//Load Recipe Data
export const loadRecipe = async function ( id ) {

    try{

        //Getting Data
        const data = await getJSON( `${ API_URL }${ id }?key=${ API_KEY }` );

        //Data Format
        let { recipe } = data.data;

        //Formatting and Storing the Recipe
        state.recipe = formatRecipe( recipe );
    }
    catch ( err ) { throw Error( err ); };

};

///////////////////////////////////////
// Search Recipe
export const searchRecipes = async function ( query ) {

    try{
        
        //Getting Data
        const data = await getJSON( `${ API_URL }?search=${ query }&key=${ API_KEY }` );

        //Saving data in the State
        state.search.query = query;
        state.search.results = data.data.recipes.map( recipe => {
            const formattedRecipe =  {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            };

            //If you created it the key is stored
            recipe.key && ( formattedRecipe.key = recipe.key );
            return formattedRecipe;
        })
    }
    catch ( err ) { throw Error( err.message ); };
};

///////////////////////////////////////
// Search Recipe Pagination
export const getSearchResultPage = function ( page = this.state.search.page ) {

    //Saves new Page in the State
    state.search.page = page;
    const { resultsPerPage } = this.state.search;

    //Calculate Start and End
    const start = ( page - 1 ) * resultsPerPage;
    const end = page * resultsPerPage;

    //Returns the Data of the chosen page
    if( state.search.results.slice ) return state.search.results.slice( start, end );
};

///////////////////////////////////////
// Update Servings
export const updateServings = function ( operation ) {

    //Increase or Decrease the Servings
    let newServings;
    if( operation == 'decrease' ) newServings = this.state.recipe.servings - 1;    
    if( operation == 'increase' ) newServings = this.state.recipe.servings + 1;

    //Recalculate the quantities and saves it in the State
    if( newServings > 0 ) {
        state.recipe.ingredients.forEach( 
            ingredient => 
                ingredient.quantity = ingredient.quantity * ( newServings / this.state.recipe.servings )
        );
        this.state.recipe.servings = newServings;   
    }
};

///////////////////////////////////////
// Bookmark Recipe
export const bookmarkRecipe = function () {

    /*
        If Recipe is already Bookmarked, Unbookmarks it 
        The bookmark attribute is used to render the Bookmark Icon in the BookmarkView 
        generateContentHTML method
    */
    const index = state.bookmark.findIndex( bookmark => bookmark.id === state.recipe.id );

    //Bookmark
    if( index === -1 ) {
        state.recipe.bookmark = true;
        state.bookmark.push( state.recipe );
    }

    //Unbookmark
    else {
        state.recipe.bookmark = false;
        state.bookmark.splice(index, 1);
    }

    //Stores bookmark on LocalStore
    localStorage.setItem( 'bookmark', JSON.stringify( state.bookmark ) );

};

///////////////////////////////////////
// Update a new Recipe in the API
export const uploadRecipe = async function ( data ) {

    try {

        //Formats the Data to POST it 
        const bodyData = {
            title: data.title,
            publisher: data.publisher,
            source_url: data.sourceUrl,
            image_url: data.image,
            servings: data.servings,
            cooking_time: data.cookingTime,
            ingredients: Object.entries( data )
                .filter( field => { 
                    const [ key, value ] = field;
                    return ( key.includes( 'ingredient' ) && value != "" )
                })
                .map( ingredient => { 
                    const ingredientDataArray = ingredient[1].split( ',' );
                    if( ingredientDataArray.length !== 3 ) 
                    throw Error( 'Wrong Ingredient Format! Please use the correct format :)' );
                    const [ quantity, unit, description ] = ingredientDataArray;
                    quantity.trim(); //In case of passing a white space
                    return { quantity,  unit,  description }
                })
        };

        //Hits the API
        var returnData = await postJSON( `${ API_URL }?key=${ API_KEY }`, bodyData );

        //When the POST works but the operation fails
        if( !returnData.status ) throw Error( 'Something went wrong. Try Again.' );

        //Formats the data, saves it in the state and bookmarks it 
        state.recipe = formatRecipe( returnData.data.recipe );
        bookmarkRecipe( state.recipe ); 
    }
    catch ( err ) {
        throw Error( err.message );
    }
};