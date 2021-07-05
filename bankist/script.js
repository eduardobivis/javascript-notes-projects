'use strict';

/////////////////////////////////////////////////
// Accounts Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [ 200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300 ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-06-09T21:31:17.178Z',
    '2021-06-08T07:42:02.383Z',
    '2021-06-10T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [ 5000, 3400, -150, -790, -3210, -1000, 8500, -30 ],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [ account1, account2 ];

//Create Usernames for each Account - Just for practing String/Array Functions!
accounts.forEach( function ( acc ) {
  acc.username = acc.owner
    .toLowerCase()
    .split( ' ' )
    .map( name => name[ 0 ] )
    .join( '' );
});

/////////////////////////////////////////////////
// DOM Elements

//Labels
const labelWelcome = document.querySelector( '.welcome' );
const labelDate = document.querySelector( '.date' );
const labelBalance = document.querySelector( '.balance__value' );
const labelSumIn = document.querySelector( '.summary__value--in' );
const labelSumOut = document.querySelector( '.summary__value--out' );
const labelSumInterest = document.querySelector( '.summary__value--interest' );
const labelTimer = document.querySelector( '.timer' );

//Containers
const containerApp = document.querySelector( '.app' );
const containerMovements = document.querySelector( '.movements' );

//Buttons
const btnLogin = document.querySelector( '.login__btn' );
const btnTransfer = document.querySelector( '.form__btn--transfer' );
const btnLoan = document.querySelector( '.form__btn--loan' );
const btnClose = document.querySelector( '.form__btn--close' );
const btnSort = document.querySelector( '.btn--sort' );

//Inputs
const inputLoginUsername = document.querySelector( '.login__input--user' );
const inputLoginPin = document.querySelector( '.login__input--pin' );
const inputTransferTo = document.querySelector( '.form__input--to' );
const inputTransferAmount = document.querySelector( '.form__input--amount' );
const inputLoanAmount = document.querySelector( '.form__input--loan-amount' );
const inputCloseUsername = document.querySelector( '.form__input--user' );
const inputClosePin = document.querySelector( '.form__input--pin' );

/////////////////////////////////////////////////
// Functions

const calcDaysPassed = ( date1, date2 ) => Math.abs( date2 - date1 ) / ( 1000 * 60 * 60 * 24 );

//Sets Labels for closer Dates
const createMovementDate = ( date, locale ) => {

  let difference = calcDaysPassed( new Date(), date );
    if ( difference <= 1 ) return 'Today';
    else if( difference <= 2) return 'Yesterday';
    else if ( difference <= 7 ) return `${ Math.round( difference ) } days ago`;
    else  return new Intl.DateTimeFormat( locale ).format( date );
};

//Formats Date with Internationalization
const createLabelDate = ( date, locale ) => { 

  return new Intl.DateTimeFormat( 
    locale, 
    { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    } 
  ).format( date );
};

//Formats Money/Currency with Internationalization
const getNumberFormatter = account => 
  new Intl.NumberFormat( account.locale, { style: 'currency', currency: account.currency } );

//Display Deposits and Withdrals
const displayMovements = function ( account, sort = false ) {
  
  containerMovements.innerHTML = '';

  const movs = sort ? account.movements.slice().sort ( ( a, b ) => a - b ) : account.movements;
  const formatter = getNumberFormatter( account );

  movs.forEach(function ( movement, i ) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${ type }">${ i + 1 } ${ type }</div>
        <div class="movements__date">
          ${ createMovementDate( new Date( account.movementsDates[ i ] ), account.locale  ) }
        </div>
        <div class="movements__value">${ formatter.format( movement.toFixed( 2 ) ) }</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML( 'afterbegin', html );
  });
};

//Display Main Balance
const calcDisplayBalance = function ( account ) {
  account.balance = account.movements.reduce( ( account, mov ) => account + mov, 0);
  const formatter = getNumberFormatter( account );
  labelBalance.textContent = formatter.format( account.balance.toFixed( 2 ) );
};

//Displays In, Out and Interest
const calcDisplaySummary = function ( account ) {

  const formatter = getNumberFormatter( account );

  labelSumIn.textContent = formatter.format( 
    account.movements
      .filter( movement => movement > 0 )
      .reduce( ( account, movement ) => account + movement, 0 )
      .toFixed( 2 ) 
  );

  labelSumOut.textContent = formatter.format(
    Math.abs(
      account.movements
        .filter( movement => movement < 0 )
        .reduce( ( account, movement ) => account + movement, 0 )
        .toFixed( 2 )
    )
  );

  labelSumInterest.textContent = formatter.format(
    acc.movements
      .filter( mov => mov > 0 )
      .map( deposit => (deposit * account.interestRate) / 100 )
      .filter( ( interest ) => { return interest >= 1; } )
      .reduce( ( account, interest ) => account + interest, 0 )
      .toFixed( 2 )
  );
};

//Updates the Interface
const updateUI = function ( account ) {
  displayMovements( account );
  calcDisplayBalance( account );
  calcDisplaySummary( account );
};

//Starts the Timer
const startLogOutTimer = timer => {
  const tick = () => {
    const min = String( Math.trunc( time / 60 ) ).padStart( 2, 0 );
    const sec = String( time % 60 ).padStart( 2, 0 );

    labelTimer.textContent = `${ min }:${ sec }`;

    //Ends the Timer, Logs the User Out
    if( time === 0 ) {
      clearInterval( timer );
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }

    time--;
  }

  let time = 300;
  tick();
  return setInterval( tick, 1000 );
};

//Reset the Timer
const resetTimer = timer => {
  if( timer ) clearInterval( timer ); 
  timer = startLogOutTimer(); 
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//Login
btnLogin.addEventListener( 'click', function ( e ) {
  
  e.preventDefault();

  //Gets the Account
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  //Checks if the Pin is Valid
  if ( currentAccount?.pin === Number( inputLoginPin.value ) ) {

    //Display UI, Welcome message and date
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split( ' ' )[0]
    }`;
    labelDate.textContent = createLabelDate( new Date(), currentAccount.locale );
    containerApp.style.opacity = 100;

    //Current Date in the Heading
    labelDate.textContent = createLabelDate( new Date(), currentAccount.locale );

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Restart Timer
    resetTimer();

    //Update UI
    updateUI( currentAccount );
  }
});

//Transfer
btnTransfer.addEventListener( 'click', function ( e ) {

  e.preventDefault();

  //Finds the Receiver Accounnt and Clears the Interface
  const amount = Number( inputTransferAmount.value );
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  //You can't transfer more than you have and you can't transfer to yourself
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {

    // Doing the transfer
    currentAccount.movements.push( -amount );
    receiverAccount.movements.push( amount );
    currentAccount.movementsDates.push( new Date().getUTCDate() );
    receiverAccount.movementsDates.push( new Date().getUTCDate() );

    //Any Action Restarts the Timer
    resetTimer();

    // Update UI
    updateUI( currentAccount );
  }
});

//Loan
btnLoan.addEventListener( 'click', function (e) {
  
  e.preventDefault();

  //Rounds down the amount and converts it to Number
  const amount = Math.floor( inputLoanAmount.value );

  //You need to have at least 10% of the Loan in your Account
  if ( amount > 0 && currentAccount.movements.some( movement => movement >= amount * 0.1 ) ) {

    //Adds movement
    currentAccount.movements.push( amount );
    currentAccount.movementsDates.push( new Date().getUTCDate() );

    //Any Action Restarts the Timer
    resetTimer();

    //Update UI
    updateUI( currentAccount );
  }

  //Clears the Input
  inputLoanAmount.value = '';

});

//Remove your Account
btnClose.addEventListener( 'click', function (e) {

  e.preventDefault();

  //Checks username and pin
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number( inputClosePin.value ) === currentAccount.pin
  ) {

    //Finds the index of the Account
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    //Removes the Account
    accounts.splice( index, 1 );

    //Hides UI
    containerApp.style.opacity = 0;
  }

  //Clear Inputs
  inputCloseUsername.value = inputClosePin.value = '';

});

//Sorting
let sorted = false;
btnSort.addEventListener( 'click', function (e) {
  e.preventDefault();
  displayMovements( currentAccount, !sorted );
  sorted = !sorted;
});
