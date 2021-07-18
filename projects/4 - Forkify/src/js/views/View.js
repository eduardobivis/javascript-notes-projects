// ABSTRACT CLASS

///////////////////////////////////////
// Imports
import icons from 'url:../../img/icons.svg';

export default class View {

    //Attributes
    _data; //Data to be rendered
    _parentElement; //Where the HTML will be render
    _errorMessage; //Custom Error Message

    //Renders the Content
    render ( data, render = true ) {

        //Checks if data exists and if its not an empty Array
        if( !data || ( Array.isArray( data ) && data.length == 0 ) ) return this.renderError();

        //Sets Data
        this._data = data;

        //Does not render, returns the Content HTML instead
        if( !render ) { 
            return this.generateContentHTML(); 
        }

        //Renders the Content HTML
        else {
            this.clear();
            this._parentElement.insertAdjacentHTML( 'afterbegin', this.generateContentHTML() );
        }
    };

    //Renders with Virtual DOM
    update ( data ) {

        //Checks if data exists and if its not an empty Array
        if( !data || ( Array.isArray( data ) && data.length == 0 ) ) return;

        //Sets Data
        this._data = data;

        //Generates the HTML of the new Content
        const newContent = this.generateContentHTML();

        //Creating a Virtual DOM of the new Content
        const newDOM = document.createRange().createContextualFragment( newContent );

        //Getting an Array with the new Elements
        const newElements = newDOM.querySelectorAll( '*' );
        
        //Getting an Array with the current Elements
        const currentElements = this._parentElement.querySelectorAll( '*' );

        //Comparing new Elements with current Element. Changes only what is different.
        newElements.forEach( (newElement, index ) => {

            //Gets current correspondent Element
            const currentElement = currentElements[ index ]; 

            //Update Changed Text
            if( 
                !newElement.isEqualNode( currentElement ) &&
                newElement.firstChild?.nodeValue.trim() !== ''
            ) 
            currentElement.textContent = newElement.textContent;

            //Update Changed Attributes
            if( !newElement.isEqualNode( currentElement ) )
                Array.from( newElement.attributes ).forEach( 
                    attr => currentElement.setAttribute( attr.name, attr.value )
                );
        });
    };

    //Renders the Spinner
    renderSpinner () { 
        this.clear();
        this._parentElement.insertAdjacentHTML( 'afterbegin', this.generateSpinnerHTML() );
    };

    //Renders the Error
    renderError ( errorMessage = this._errorMessage   ) {
        this.clear();
        this._parentElement.insertAdjacentHTML( 'afterbegin', this.generateErrorHTML( errorMessage ) );
    };

    //Clears the Content
    clear () { 
        this._parentElement.innerHTML = '';
    };

    //Generates the HTML of the Content - Implemented in the Child 
    generateContentHTML () { return ''; }

    //Generates the HTML of the Spinner
    generateSpinnerHTML () {
        return `
            <div class="spinner">
                <svg>
                    <use href="${ icons }#icon-loader"></use>
                </svg>
            </div>`;
    };

    //Generates the HTML of the Error
    generateErrorHTML ( errorMessage ) {
        return `
            <div class="error">
                <div>
                    <svg>
                        <use href="src/img/icons.svg#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${ errorMessage }</p>
            </div>
        `;
    };

};