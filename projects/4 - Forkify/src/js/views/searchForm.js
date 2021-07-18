///////////////////////////////////////
// Imports
import View from './View';

class searchForm extends View {

    //Attributes
    _parentElement = document.querySelector( '.search' );
    _inputSearchElement = document.querySelector( '.search__field' );

    //Gets the value searched and clears the Input
    getQuery () {
        const query = this._inputSearchElement.value;
        this.clearInput();
        return query;
    };

    //Handles Submiting the Search Form ( Published Subscriber Pattern )
    addHandlerSearch( handler ) {

        this._parentElement.addEventListener( 'submit', function ( event ) {
            event.preventDefault();
            handler();
        });
    };

    //Clears the Search Input
    clearInput () { 
        this._inputSearchElement.value = '';
    };
    
};

//Exports an instance of the Class
export default new searchForm();