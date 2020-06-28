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


// Scroll Service Class - Listens and Changes size of lightbox on Scroll
  // listen for scroll Event
  // onScroll handler - calculate new width of div


// UI Class - Handles Lightbox UI
  // Event: Display data from XHR Requests
class UI { 
  static displayLightBox() {
    async function getData() {
      const ENDPOINT = 'http://homework.warbyparker.com';
      const RESTClient = new RESTService();
    
      try {
        let response = await RESTClient.get(ENDPOINT);
        console.log('testing response from getData: ', response);

        UI.renderLightBox(response);

      } catch(error) {
        console.log('RESTService error. How are you gentlepeople !! All your base are belong to us: ', error);
      }
    }
    getData();
  }

  static renderLightBox(response) {
    const { images, author, publication, quote } = response;

    // Template literal function for creating li markup
    const lightboxImgMarkup = image => {
      let imgAlt = image.match( /[^\-]+(?=\.[^\/.]*$)/ )[0];
      return `<li class="lightbox__img">
        <img src="${image}" alt="Jack Kerouac profile photo in ${imgAlt} filter" />
      </li>`;
    };

    // Template literal function for creating ul markup
    const lightboxContainerMarkup = listItems => {
      return `<ul class="lightbox__img-container">${listItems.join('')}</ul>`;
    };

    // Template literal for publication div markup
    const lightboxTextContainer = `
      <div class="lightbox__text-container">
        <blockquote class="lightbox__text-quote">${quote}</blockquote>
        <div class="lightbox__text-author">${author}</div>
        <div class="lightbox__text-pub">${publication}</div>
      </div>`;

    // Build li markup for each image
    const lightboxImgArray = images.map( img => lightboxImgMarkup(img) );

    // Append list item markup to ul container
    const lightboxImageContainer = lightboxContainerMarkup(lightboxImgArray);

    // Insert all elements into DOM
    const lightboxRoot = document.querySelector('.lightbox');
    lightboxRoot.insertAdjacentHTML('afterbegin', lightboxImageContainer);
    lightboxRoot.insertAdjacentHTML('beforeend', lightboxTextContainer);
  }
}
  
// Event: Display data from XHR Requests
document.addEventListener('DOMContentLoaded', UI.displayLightBox);

const myUI = new UI();
