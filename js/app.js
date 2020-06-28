console.log('app.js');

// REST Service Class - Handles XHR requests
  // use XHR to make request
  // only GET method needed
  // return promise for async handling

class RESTService {
  constructor() {
    this._rawResponse = null;
  }

  _makeRequest(resource = '', method = 'GET') {
    const xhr = new XMLHttpRequest();

    xhr.open(method, resource, true);

    return new Promise(function(resolve, reject) {
      xhr.responseType = 'json';

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function(e) {
        if (xhr.status > 300) {
          reject('Error, status code: ', xhr.status);
        } else {

          // in case we need to save the raw response:
          this._rawResponse = xhr.response
          resolve(xhr.response);
        }
      }
      xhr.send();
    })
  }

  get(resource = '') {
    return this._makeRequest(resource, 'GET');
  }
}

async function getData() {
  const ENDPOINT = 'http://homework.warbyparker.com';
  const RESTClient = new RESTService();

  try {
    let response = await RESTClient.get(ENDPOINT);
    console.log('testing response from async: ', response);
  } catch(error) {
    console.log('RESTService error. How are you gentlepeople !! All your base are belong to us: ', error);
  }
}
getData();


// Scroll Service Class - Listens and Changes size of lightbox on Scroll
  // listen for scroll Event
  // onScroll handler - calculate new width of div

// UI Class - Handles Lightbox UI
  // Event: Display data from XHR Requests

