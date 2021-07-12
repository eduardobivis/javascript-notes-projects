///////////////////////////////////////
// Imports
import { TIMEOUT_SEC } from './config'

//Timeout for Fetch Calls
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

//GET Fetch Call
export async function getJSON( url ) {
    try{ 
        const res = await Promise.race( [ fetch( url ), timeout( TIMEOUT_SEC ) ] );

        const data = await res.json();
        if( !res.ok ) throw Error ( `${ res.status } - ${ data.message }` );

        return data;
    }
    catch ( err ) { throw Error ( err.message );  }
}

//POST Fetch Calls
export async function postJSON( url, bodyData ) {
  try{ 
      const res = await Promise.race( 
        [ 
          fetch( url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( bodyData )
          }), 
          timeout( TIMEOUT_SEC ) 
        ] 
      );

      const data = await res.json();
      if( !res.ok ) throw Error ( `${ res.status } - ${ data.message }` );

      return data;
  }
  catch ( err ) { throw Error ( err.message );  }
}