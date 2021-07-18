///////////////////////////////////////
// Imports
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchForm from './views/searchForm';
import searchListView from './views/searchListView';
import BookmarkListView from './views/bookmarkListView';
import paginationView from './views/paginationView';
import bookmarkListView from './views/bookmarkListView';
import addRecipeView from './views/addRecipeView';

///////////////////////////////////////
// Render Recipe
const loadPage = async function () {
  try {
    await selectRecipe();
    loadBookmark();
  }
  catch( err ) { recipeView.renderError(); };
};

//Load Bookmarks from Local Storage
const loadBookmark = function () {
  if( localStorage.getItem( 'bookmark' ) ) {
    model.state.bookmark = JSON.parse( localStorage.getItem( 'bookmark' ) );
    bookmarkListView.render( model.state.bookmark );
  }
};

//Renders the Selected Recipe
const selectRecipe = async function () {
  try { 

    //Getting Data
    if( !window.location.hash ) return;
    recipeView.renderSpinner();
    await model.loadRecipe( window.location.hash.slice( 1 ) )

    //Check if Recipe is Bookmarked, Set as Bookmarked ( to render the Bookmark Icon )
    if( model.state.bookmark.some( bookmark => bookmark.id === model.state.recipe.id ) )
      model.state.recipe.bookmark = true;

    //Re-Render the SearchResultsList and BookmarkList to mark the Recipe as selected
    searchListView.update( model.getSearchResultPage() ); //Loads through Virtual DOM
    BookmarkListView.render( model.state.bookmark );

    //Rendering
    recipeView.render( model.state.recipe )

  }
  catch( err ) { throw Error( err ) };
};

///////////////////////////////////////
// Search Recipe
const controlSearchRecipes = async function () {
  try {

    //Reset Page
    model.state.search.page = 1;
    searchListView.renderSpinner();

    //Getting Data
    if( !window.location.hash ) return;
    await model.searchRecipes( searchForm.getQuery() );

    //Render Data and Pagination
    renderPageAndPagination();
    
  }
  catch( err ) { searchListView.renderError(); };
};

///////////////////////////////////////
// Search Recipe Pagination
const renderPageAndPagination = function () {

  //Render Data
  searchListView.render( model.getSearchResultPage() );

  //Render Pagination
  paginationView.render( model.state.search );
};

//Handler
const controlPagination = function ( direction ) {

  //Change Page
  if( direction === 'prev' ) model.state.search.page--;
  if( direction === 'next' ) model.state.search.page++;

  //Render Data and Pagination
  renderPageAndPagination();
};

///////////////////////////////////////
// Update Servings
const controlUpdateServings = function ( operation ) {
  model.updateServings( operation );
  recipeView.update( model.state.recipe ); //Loads through Virtual DOM
};

///////////////////////////////////////
// Bookmark Recipe 
const controlBookmarkRecipe = function () {
  model.bookmarkRecipe();
  recipeView.update( model.state.recipe ); //Loads through Virtual DOM
  BookmarkListView.render( model.state.bookmark );
};

///////////////////////////////////////
// Upload Recipes
const uploadRecipe = async function ( recipeData ) {

  try { 

      //Upload Recipe to the API and renders it 
      addRecipeView.renderSpinner();
      await model.uploadRecipe( recipeData );
      addRecipeView.renderMessage();

      //Set Recipe ID on URL
      window.history.pushState( null, '', `#${ model.state.recipe.id }`)

      await loadPage();

  }
  catch( err ) { addRecipeView.renderError( err ) };

}

//Init Handlers - Published Subscriber Pattern
const init = () => { 
  addRecipeView.addHandlerSubmit( uploadRecipe );
  recipeView.addHandlerRender( loadPage, selectRecipe );
  recipeView.addHandlerClick( controlUpdateServings, controlBookmarkRecipe );
  searchForm.addHandlerSearch( controlSearchRecipes );
  paginationView.addHandlerClick( controlPagination );
};

init();

//BUGFIX
//No hash in the URL
//Remove _
//Review, Format and Comment all code
