///////////////////////////////////////
// Imports
import icons from 'url:../../img/icons.svg';
import View from './View';

class paginationView extends View {

    _parentElement = document.querySelector( '.pagination' );
    _errorMessage = 'We could not find that recipe. Please try another one!';
    _message;

    //Handles clicking Prev/Next Pagination button
    addHandlerClick ( handler )  {
        this._parentElement.addEventListener( 'click', function ( event ) {
            if( event.target.closest( '.pagination__btn--prev' ) ) handler( 'prev' );
            if( event.target.closest( '.pagination__btn--next' ) ) handler( 'next' );
        });
    };

    //Generates the HTML of the Content
    generateContentHTML () {
        
        const { page, resultsPerPage, results } = this._data;
        const lastPage = Math.ceil( results.length / resultsPerPage );

        if( page === 1 ){

            //First Page, Only 1 Page - No Button
            if( lastPage === 1 ) return ``;

            //First Page - Only Next Button
            return this.generatePaginationButtonHTML( 'next', page );
        }

        //Last Page - Only Prev Button
        if( page === lastPage ) 
            return this.generatePaginationButtonHTML( 'prev', page );

        //Not First or Last Page - Prev and Next Button
        return `
            ${ this.generatePaginationButtonHTML( 'prev', page ) } 
            ${ this.generatePaginationButtonHTML( 'next', page ) }`;
    }

    //Generates the HTML of Pagination Buttons 
    generatePaginationButtonHTML( direction, currentPage ){

        if ( direction == 'prev' )
            return `
                <button class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${ icons }#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${ currentPage - 1 }</span>
                </button>`;
        
            
        if ( direction == 'next' )
            return `
                <button class="btn--inline pagination__btn--next">
                    <span>Page ${ currentPage + 1 }</span>
                    <svg class="search__icon">
                        <use href="${ icons }#icon-arrow-right"></use>
                    </svg>
                </button>`;

    }
};

export default new paginationView();