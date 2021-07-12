///////////////////////////////////////
// Imports
import View from './View';
import RecipeListItemView from './recipeListItemView';

class searchListView extends View {

    //Attributes
    _parentElement = document.querySelector( '.results' );
    _errorMessage = "No recipes found for your query";

    //Generates the HTML of the Content
    generateContentHTML () {
        return this._data.map( recipe => RecipeListItemView.render( recipe, false ) ).join( '\n' );
    };
    
};

//Exports an instance of the Class
export default new searchListView();