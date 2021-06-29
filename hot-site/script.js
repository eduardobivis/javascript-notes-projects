'use strict';

///////////////////////////////////////
// DOM Elements

const modal = document.querySelector( '.modal' );
const overlay = document.querySelector( '.overlay' );
const btnCloseModal = document.querySelector( '.btn--close-modal' );
const btnsOpenModal = document.querySelectorAll( '.btn--show-modal' );
const btnScrollTo = document.querySelector( '.btn--scroll-to' );
const section1 = document.querySelector( '#section--1' );
const operationsContainer = document.querySelector( '.operations__tab-container' );
const nav = document.querySelector( '.nav' );

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove( 'hidden' );
  overlay.classList.remove( 'hidden' );
};

const closeModal = function () {
  modal.classList.add( 'hidden' );
  overlay.classList.add( 'hidden' );
};

btnsOpenModal.forEach( element => element.addEventListener( 'click', openModal ) );
btnCloseModal.addEventListener( 'click', closeModal );

//Close Modal when clicking on the Dark Background
overlay.addEventListener( 'click', closeModal );

//Close modal when pressing Esc
document.addEventListener( 'keydown', function (e) {
  if ( e.key === 'Escape' && !modal.classList.contains( 'hidden' ) ) {
    closeModal();
  }
});


///////////////////////////////////////
// Menu

//When hovering a nav item, blur the other ones
const hoverEffect = function( event ) {
  if( event.target.classList.contains( 'nav__link' ) || ( event.type === 'mouseleave' ) ) {
    document.querySelectorAll( '.nav__link' ).forEach( 
      element => ( event.target !== element ) && ( element.style.opacity = this )
    );
    nav.querySelector( '.nav__logo' ).style.opacity = this;
  }
}
/* The event is passed as first parameter automatically, the opacity becomes the 'this' element, no more 
paramaters can be passed - its a 'hack' */
nav.addEventListener( 'mouseover', hoverEffect.bind( 0.5 ) ); 
nav.addEventListener( 'mouseleave', hoverEffect.bind( 1 ) ); 


///////////////////////////////////////
// Scrolling ( Event Delegation )

btnScrollTo.addEventListener( 'click', event => section1.scrollIntoView( { behaviour: 'smooth' } ) );
document.querySelector( '.nav__links' ).addEventListener( 'click', event => {
  if( event.target.classList.contains( 'nav__link' ) )
    document.querySelector( event.target.getAttribute( 'href' ) ).scrollIntoView( { behaviour: 'smooth' } )
});

///////////////////////////////////////
// Tabbed Component ( Event Delegation )

operationsContainer.addEventListener( 'click', event => {
  if( event.target.classList.contains( 'operations__tab' ) ) {

    //Toggles Tab Active Class
    document.querySelectorAll( '.operations__tab' ).forEach( element => {
      if ( element.classList.contains( 'operations__tab--active' ) ) 
        element.classList.remove( 'operations__tab--active' )
    });
    event.target.classList.add( 'operations__tab--active' );

    //Toggles Panel Active Class
    document.querySelectorAll( '.operations__content' ).forEach( element => {
      if( element.classList.contains( 'operations__content--active' ) )
        element.classList.remove( 'operations__content--active' );
    });
    document
      .querySelector( `.operations__content--${ event.target.dataset.tab }` )
      .classList.add( 'operations__content--active' );
  }
})

///////////////////////////////////////
// Menu Always on Top ( Observer )

const navDimensions = nav.getBoundingClientRect();
new IntersectionObserver(
  entries =>  ( !entries[0].isIntersecting ) ? nav.classList.add( 'sticky' ) : nav.classList.remove( 'sticky' ), 
  {
    root: null, 
    threshold: 0, 
    rootMargin: `${ -navDimensions.height }px` 
  }
).observe( document.querySelector( '.header' ) );

///////////////////////////////////////
// Sections appear while the user scrolls ( Observer )

const sectionObserver = new IntersectionObserver(
  ( entries, observer ) => { 
    const [ entry ] = entries;
    if( entry.isIntersecting ) {
      entry.target.classList.remove( 'section--hidden' ) ; 
      observer.unobserve( entry.target ); //Stops the Observation for the current target
    }
  },
  { root: null, threshold: 0.15 }
)
document.querySelectorAll( '.section' ).forEach( section => {
  // section.classList.add( 'section--hidden' );
  sectionObserver.observe( section );
});

///////////////////////////////////////
// Lazy Loading Images ( Observer )

const lazyLoadObserver = new IntersectionObserver(
  ( entries, observer ) => { 
    const [ entry ] = entries;
    if ( entry.isIntersecting ) {
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener( 'load', () => 
        entry.target.classList.remove( 'lazy-img' ) //Removes Blur filter only after Loading the high quality image
      );
      observer.unobserve( entry.target );
    }
  },
  { root: null, threshold: 0 }
)
document.querySelectorAll( 'img[data-src]' ).forEach( element => lazyLoadObserver.observe ( element ) );

///////////////////////////////////////
// Carrousel

//State Variables
const slides = document.querySelectorAll( '.slide' );
let currentSlide = 0;

//Creates Dots
slides.forEach( ( _, index ) => 
  document.querySelector( '.dots' ).insertAdjacentHTML( 
    'beforeEnd', 
    `<div class="dots__dot ${ index === 0  ? 'dots__dot--active' : '' }" data-slide="${ index }"></div>`
  )
);

//Activates a Dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

//Moving Slides
const moveSlide = () => 
  slides.forEach( ( element, i ) => 
    element.style.transform = `translateX( ${ ( ( 100 * ( i - currentSlide ) ) ) }% )` );
moveSlide();

const moveRight = () => {
  if ( currentSlide === ( slides.length - 1 ) ) currentSlide = 0;
  else currentSlide++;
  activateDot( currentSlide );
  moveSlide();
}

const moveLeft = () => {
  if ( currentSlide === 0 ) currentSlide = slides.length - 1;
  else currentSlide--;
  activateDot( currentSlide );
  moveSlide();
}

//Arrows
document.querySelector( '.slider__btn--right' ).addEventListener( 'click', () => moveRight() )
document.querySelector( '.slider__btn--left' ).addEventListener( 'click', ()  => moveLeft() );

//It also slides with Keyboard Arrows Keys
document.addEventListener( 'keydown', event => {
  if ( event.key == 'ArrowLeft') moveLeft();
  if ( event.key === 'ArrowRight' ) moveRight(0);
});

//Activating Dots when Clicking
document.querySelector( '.dots' ).addEventListener( 'click', event => {
  currentSlide = Number( event.target.dataset.slide );
  activateDot( currentSlide );
  moveSlide();
})







