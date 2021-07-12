///////////////////////////////////////
// Imports
import icons from 'url:../../img/icons.svg';
import View from './View';

class RecipeListItemView extends View {

    //Generates the HTML of the Content
    generateContentHTML () {

        const currentId = window.location.hash.slice( 1 );

        return `
            <li class="preview">
                <a class="preview__link ${ currentId === this._data.id ? 'preview__link--active' : '' }" 
                    href="#${ this._data.id }">
                    <figure class="preview__fig">
                        <img src="${ this._data.image }" alt="Test" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${ this._data.title.slice( 0, 23 ) } ...</h4>
                        <p class="preview__publisher">${ this._data.publisher }</p>
                        <div class="preview__user-generated  ${this._data.key ? '' : 'hidden'}">
                            <svg>
                                <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>
                    </div>
                </a>
            </li>`;
    }
};

//Exports an instance of the Class
export default new RecipeListItemView();