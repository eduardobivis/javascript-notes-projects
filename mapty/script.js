'use strict';

// Comments between # are for studying porpose !

///////////////////////////////////////
// DOM Elements

const form = document.querySelector( '.form' );
const containerWorkouts = document.querySelector( '.workouts' );
const inputType = document.querySelector( '.form__input--type' );
const inputDistance = document.querySelector( '.form__input--distance' );
const inputDuration = document.querySelector( '.form__input--duration' );
const inputCadence = document.querySelector( '.form__input--cadence' );
const inputElevGain = document.querySelector( '.form__input--elevation' );
const btnRemoveAll = document.querySelector( '.removeAll' );

///////////////////////////////////////
// APP Class

class App {

    //Attributes
    #mapEvent;
    #map;
    #workouts = [];
    #markers = {};
    #mapZoomLevel = 13;
    #editId;

    //Validation
    #validationMessage = 'Inputs have to be positive numbers';
    #validate = ( ...inputs ) => inputs.every( 
        ( input ) => ( Number.isFinite( Number( input ) ) && input !== '' && Number( input ) > 0  ) 
    );

    //Loads Map, Event Listeners
    constructor() {

        //shows the map
        this.loadMap();

        //Binding 'this' cause Event Callback function have 'this' as the target element
        
        //When submiting the Form
        form.addEventListener( 'submit', this.handleFormSubmit.bind( this )); //the event parameter is passed automatically

        //when changing the activity Type
        inputType.addEventListener( 'change', this.toggleType );

        //when clicking in the workout the map moves to the marker
        containerWorkouts.addEventListener( 'click', this.handleWorkoutClick.bind( this ) );

        //delete All Workouts
        btnRemoveAll.addEventListener( 'click', this.deleteAllWorkouts.bind( this ) );
        
    }

    loadMap () {

        if( navigator.geolocation )
            navigator.geolocation.getCurrentPosition (
                
                function ( position ) {

                    const { latitude, longitude } = position.coords;
                    const coords = [ latitude, longitude ];

                    this.#map = L.map( 'map' ).setView( coords, this.#mapZoomLevel );

                    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo( this.#map );

                    this.#map.on('click', this.showForm.bind( this ) );

                    //Runs the saved data
                    this.getLocalStorage();

                //Regular function have 'this' as undefined
                }.bind( this ), 

                () => console.log( 'Could not get your position' )
            )
        else console.log( 'Could not get your position' );
    }

    showForm ( mapEv ) {
        this.#mapEvent = mapEv;
        inputDistance.value =  inputDuration.value =  inputCadence.value = inputElevGain.value = '';
        form.classList.remove( 'hidden' );
    }
    
    hideForm() {
        inputDistance.value =  inputDuration.value =  inputCadence.value = inputElevGain.value = '';         
        form.classList.add( 'hidden' ); 
    }

    toggleType () {
        
        if( this.value === 'running' ) {
            inputCadence.closest( '.form__row' ).classList.remove( 'form__row--hidden' );
            inputElevGain.closest( '.form__row' ).classList.add( 'form__row--hidden' );
        }
        else if ( this.value === 'cycling' ){
            inputElevGain.closest( '.form__row' ).classList.remove( 'form__row--hidden' ); 
            inputCadence.closest( '.form__row' ).classList.add( 'form__row--hidden' );
        }
    }

    handleFormSubmit ( event ) {
        event.preventDefault();
        ( !this.#editId ) ? this.createWorkout() : this.updateWorkout(); 
    }

    handleWorkoutClick ( event ) { //Event Delegation

        //Closets gets the closest parent ( doesn't get siblings! )
        const workoutContainer = event.target.closest( '.workout' );

        if ( workoutContainer ) {

            //Delete Workout
            if( event.target.classList.contains( 'delete-workout' ) ) this.deleteWorkout( workoutContainer );
            else {

                //Move to Marker
                this.moveToMarker( workoutContainer );     

                //Edit Workout
                if( event.target.classList.contains( 'edit-workout' ) ) 
                    this.editWorkout( workoutContainer.dataset.id );
            }     
        }
    }

    createWorkout () {

        //Input Data
        const coords = Object.values( this.#mapEvent.latlng );
        const type = inputType.value;
        const duration = inputDuration.value;
        const distance = inputDistance.value;
        let workout;

        //Creates Workout
        if( type === 'running' ) {
            const cadence = inputCadence.value;
            if( !this.#validate( duration, distance, cadence ) ) return alert( this.#validationMessage );
            workout = new Running( coords, duration, distance, cadence );     
        }
        if( type === 'cycling' ) {
            const elevGain = inputElevGain.value;
            if( !this.#validate( duration, distance, elevGain ) ) return alert( this.#validationMessage );
            workout = new Cycling( coords, duration, distance, elevGain );
        }
    
        this.renderWorkout( workout );
    }

    renderWorkout ( workout ) {
        this.#markers[ workout.getId() ] = this.createMarker( workout );
        this.#workouts.push( workout );
        form.insertAdjacentHTML( 'afterend', workout.renderHTML() );
        this.hideForm();
        this.setLocalStorage(); //stores it on LocalStorage
    }

    createMarker ( workout ) {
        return L.marker( workout.getCoords() )
        .addTo(this.#map)
        .bindPopup( workout.getPopupTitle(), {
            maxWidth: 250,
            maxHeight: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${ workout.getType() }-popup`
        })
        .openPopup();
    }

    editWorkout ( id ) {

        this.#editId = id;

        //Get Workout Object
        const workout = this.#workouts.find( work => work.getId() === this.#editId );

        this.showForm();

        //Updating the Interface ( Set Data in the Form )
        inputType.value = workout.getType();
        inputType.dispatchEvent(new Event('change')); //Triggers event programatically

        inputDistance.value = workout.getDistance();
        inputDuration.value = workout.getDuration();
        
        if( workout.getType() === 'running' ) inputCadence.value = workout.getCadence();
        else if( workout.getType() === 'cycling' ) inputElevGain.value = workout.getElevGain();
        
    }

    updateWorkout () {

        //Input Data
        const type = inputType.value;
        const distance = inputDistance.value;
        const duration = inputDuration.value;

        //Validation
        if( type === 'running' ) {
            const cadence = inputCadence.value;
            if( !this.#validate( duration, distance, cadence ) ) return alert( this.#validationMessage );
        }
        if( type === 'cycling' ) {
            const elevGain = inputElevGain.value;
            if( !this.#validate( duration, distance, elevGain ) ) return alert( this.#validationMessage );
        }

        //Get Workout Object
        let workout = this.#workouts.find( work => work.getId() === this.#editId );

        //Set Data in the Workout
        workout.setDistance( distance );
        workout.setDuration( duration );

        //If the type as changed
        if ( workout.getType != inputType.value ) {

            //Convert the object
            if( workout.getType() === 'running' ) {
                workout = this.runningToCycling( workout, inputElevGain.value );
            }
            else if( workout.getType() === 'cycling' )
                workout = this.cyclingToRunning( workout, inputCadence.value );

            //Replace the Workout in the State
            const pos = this.#workouts.findIndex( work => work.getId() === this.#editId );
            this.#workouts[ pos ] = workout;

        }
        else {
            workout.setType( inputType.value );
            if( inputType.value === 'running' ) workout.setCadence( inputCadence.value );
            else if( inputType.value === 'cycling' ) workout.setElevGain( inputElevGain.value );
        }
        
        //Updating the Interface
        this.hideForm();
        var template = document.createElement( 'template' );
        template.innerHTML = workout.renderHTML();
        document.querySelector( `[data-id="${ workout.getId() }"]` ).replaceWith( template.content.firstChild  );

        //Clearing State Value
        this.#editId = undefined;
    }

    deleteAllWorkouts() {
        document.querySelectorAll( '.workout' ).forEach( function ( element ) {
            this.deleteWorkout( element );
        }.bind( this ))
    }

    deleteWorkout( container ) {

        //Clearing State Value, in case the User switched from Edit to Delete
        this.#editId = undefined;

        //Acessing the attribute May not be a Workout Object
        const pos = this.#workouts.findIndex( work => work.getId() === container.dataset.id );
        
        if ( pos >= 0 ) { 
            this.#map.removeLayer( this.#markers[ this.#workouts[ pos ].getId() ] );
            this.#workouts.splice( pos, 1 );
            container.remove();
            this.setLocalStorage();
        }

        //Hides the Form
        this.hideForm();
    }

    moveToMarker( container ) {
        const workout = this.#workouts.find( work => work.getId() === container.dataset.id );
        this.#map.setView( workout.getCoords(), this.#mapZoomLevel, { animate: true, duration: 1 } );
    }

    setLocalStorage () {
        localStorage.setItem( 'workouts', JSON.stringify( this.#workouts ) );
    }

    getLocalStorage () {
        JSON.parse( localStorage.getItem( 'workouts' ) ).forEach( function ( element ) {

            //Cast done manually
            let workout;

            if( element.type === 'running' ) 
                workout = new Running( 
                    element.coords, element.distance, element.duration, element.cadence, element.id, 
                    new Date( element.date )
                );
            if( element.type === 'cycling' )
                workout = new Cycling( 
                    element.coords, element.distance, element.duration, element.elevGain, element.id, 
                    new Date( element.date )
                );

            if( workout ) {
                this.renderWorkout( workout );
            }   

        }.bind( this ) );
    }

    runningToCycling ( workout, elevGain ) {
        return new Cycling(
            workout.coords, workout.distance, workout.duration, elevGain, workout.id, workout.date
        );
    }

    cyclingToRunning ( workout, cadence ) {
        return new Running(
            workout.coords, workout.distance, workout.duration, cadence, workout.id, workout.date
        );
    }
}

///////////////////////////////////////
// Workout, Riding and Cycling Classes

class Workout {

    //################################################################################################
    //# JSON stringfy DOESN'T work with private attributes, so you need to keep it public ¯\_(ツ)_/¯ #
    //################################################################################################ 

    id;
    date;
    type;
    coords;
    distance;
    duration;

    constructor ( 
        type, coords, distance, duration, 
        id = String( Date.now() ).slice( -10 ), 
        date = new Date() 
    ) {
        this.id = id;
        this.date = date;
        this.type = type;
        this.coords = coords; //[ lat, lng ]
        this.distance = Number( distance ); //in km
        this.duration = Number( duration ); //in min
    }

    setType( type ) { this.type = type; }

    setDistance( distance ) { this.distance = distance }

    setDuration( duration ) { this.duration = duration }

    getId () { return this.id }

    getCoords () { return this.coords; }

    getType () { return this.type; }

    getDistance () { return this.distance; }

    getDuration () { return this.duration; }

    getDescription () {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${ this.type[ 0 ].toUpperCase() + this.type.slice( 1 ) }` + 
            ` on ${ months[ this.date.getMonth() ] } ${ this.date.getDate() }`;
    }

    getPopupTitle () {
        return `${ ( this.type === 'running' ? '🏃‍♂️' : '🚴‍♀️') } ${ this.getDescription() }`;
    }
    
    renderHTML () {
        return `<li class="workout workout--${ this.type }" data-id="${ this.id }">
            <h2 class="workout__title">${ this.getDescription() } 
                <span class="edit-workout">✏️</span>
                <span class="delete-workout">❌</span>
            </h2>
            <div class="workout__details">
                <span class="workout__icon">${ this.type === 'running' ? '🏃‍♂️' : '🚴‍♀️' }</span>
                <span class="workout__value">${ this.distance }</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${ this.duration }</span>
                <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">
                    ${ this.type === 'running' 
                        ? this.getPace().toFixed( 2 ) 
                        : this.getSpeed().toFixed( 2 ) 
                    }
                </span>
                <span class="workout__unit">
                    ${ this.type === 'running' ? 'min/km' : 'km/h' }
                </span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">
                    ${ this.type === 'running' ? '🦶🏼' : '⛰' }
                </span>
                <span class="workout__value">
                    ${ this.type === 'running' ? this.getCadence() : this.getElevGain() }
                </span>
                <span class="workout__unit">
                    ${ this.type === 'running' ? 'spm' : 'm' }
                </span>
            </div>
        </li>`;
    }
}

class Running extends Workout {

    cadence;
    pace;

    constructor( coords, distance, duration, cadence, id = undefined, date = undefined ) {
        super( 'running', coords, distance, duration, id, date );
        this.cadence = Number( cadence );
        this.pace = this.getDuration() / this.getDistance();
    }

    setCadence ( cadence ) { this.cadence = cadence; }
    
    getCadence () { return this.cadence; }

    getPace () { return this.pace; }
}

class Cycling extends Workout {
    
    elevGain;
    speed;
    
    constructor( coords, distance, duration, elevGain, id = undefined, date = undefined ) {
        super( 'cycling', coords, distance, duration, id, date );
        this.elevGain = Number( elevGain );
        this.speed = this.getDistance() / ( this.getDuration() / 60 );    
    }

    setElevGain ( elevGain ) { this.elevGain = elevGain; }

    getElevGain () { return this.elevGain; }

    getSpeed () { return this.speed; }
}

const app = new App();
