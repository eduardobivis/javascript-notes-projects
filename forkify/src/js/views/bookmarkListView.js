///////////////////////////////////////
// Imports
import View from './View';
import RecipeListItemView from './recipeListItemView';

class BookmarkListView extends View {

    //Atrributes
    _parentElement = document.querySelector( '.bookmarks__list' );
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
    _message;

    //Generates the HTML of the Error
    generateErrorHTML ( errorMessage ) {
        return `
            <div class="message">
                <div>
                    <svg>
                        <use href="src/img/icons.svg#icon-smile"></use>
                    </svg>
                </div>
                <p> ${ errorMessage } </p>
            </div>
        `;
    }

    //Generates the HTML of the Content
    generateContentHTML () {
        return this._data.map( recipe => RecipeListItemView.render( recipe, false ) ).join( '\n' );
    }
};

//Exports an instance of the Class
export default new BookmarkListView();