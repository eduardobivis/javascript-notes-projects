///////////////////////////////////////
// Imports
import icons from 'url:../../img/icons.svg';
import View from './View';

class AddRecipeView extends View {

    //Attributes - Elements
    _parentElement = document.querySelector( '.add-recipe-window' );
    _errorContainer = document.querySelector( '.error' );
    _formElement = document.querySelector( '.upload' );
    _btnOpenWindow = document.querySelector( '.nav__btn--add-recipe' );
    _btnCloseWindow = document.querySelector( '.btn--close-modal' );

    //Attributes - Messages
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
    _successMessage = 'Recipe was successfully uploaded :)';

    //Init Handlers
    constructor () {
        super();
        this.handleOpenWindow();
        this.handleCloseWindow();
    };

    //Handles opening the Modal
    handleOpenWindow () {
        this._btnOpenWindow.addEventListener( 'click', function () {
            this._parentElement.classList.remove( 'hidden' );
        }.bind( this ) );
    };

    //Handles closing the Modal
    handleCloseWindow () {
        this._btnCloseWindow.addEventListener( 'click', function () {
            this._parentElement.classList.add( 'hidden' );
        }.bind( this ) );
    }

    //Works but its Ugly as Fuck
    /*
        _handleOpenCloseWindow () {
            [ this._btnOpenWindow, this._btnCloseWindow ].forEach( function ( element ) {
                element.addEventListener( 'click', function () {
                    this._parentElement.classList.toggle( 'hidden' );
                }.bind( this ) );
            }.bind( this ))
        }
    */

    //Handles Submitting the Form ( Published Subscriber Pattern )
    addHandlerSubmit ( handler ) {
        this._formElement.addEventListener( 'submit', function ( event ) {
            event.preventDefault();
            
            //Gets an Array with the Form Data ( field => value ) and converts it into an Object
            const formData = Object.fromEntries( [ ...new FormData( this._formElement ) ] );
            handler( formData );

        }.bind( this ) );
    };

    // In this class the Spinner, Errors and Messages are not displayed in the Parent Element Container
    
    //Renders the Spinner
    renderSpinner () { 
        this._errorContainer.innerHTML = '';
        this._errorContainer.insertAdjacentHTML( 'afterbegin', this.generateSpinnerHTML() );
    };

    //Renders the Error
    renderError ( errorMessage = this._errorMessage ) {
        this._errorContainer.innerHTML = '';
        this._errorContainer
            .insertAdjacentHTML( 
                'afterbegin', 
                this.generateErrorHTML( errorMessage ) 
            );
    };
    
    //Renders the Success
    renderMessage ( _successMessage = this._successMessage   ) {
        this._errorContainer.innerHTML = '';
        this._errorContainer
            .insertAdjacentHTML( 
                'afterbegin', 
                this.generateSuccessHTML( _successMessage ) 
            );
    };

    //Renders the Spinner
    generateSuccessHTML ( successMessage ) {
        return `
            <div class="message">
                <div>
                    <svg>
                        <use href="${ icons }#icon-smile"></use>
                    </svg>
                </div>
                <p>${ successMessage }</p>
            </div>`
    };

    //Generates the HTML of the Success
    generateContentHTML () {
        return this._data.map( recipe => BookmarkListItemView.render( recipe, false ) ).join( '\n' );
    };
    
};

export default new AddRecipeView();