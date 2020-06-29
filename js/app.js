// REST Service Class - Handles XHR requests
  // use XHR to make request
  // only GET method needed
  // return promise for async handling
class RESTService {
  constructor() {
    this._rawResponse = null;
  }

  /**
   * Utilizes XMLHttpRequest to generate and make an XHR request
   * @param  {?string} resource endpoint to call
   * @param  {?Object} data request data to post
   * @return {Promise} resolve/reject result from the call
   */
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
  
 /**
  * Shorthand method for making a GET request
  * @param {string} resource - endpoint to call
  * @return {Promise} resolve/reject from the request
  */
  get(resource = '') {
    return this._makeRequest(resource, 'GET');
  }
}


// Scroll Service Class - Listens and Changes size of lightbox on Scroll
  // listen for scroll Event
  // onScroll handler - calculate new width of div
class ScrollService {
  constructor() {
    this._onScroll = this._onScroll.bind(this);
    this._listen();
  }

  /**
   * Adds scroll event listener.
   */
  _listen() {
    window.addEventListener('scroll', this._onScroll);
  }

  /**
   * Handler for window's scroll event. Calls _calculate once per animation frame.
   */
  _onScroll() {
    window.requestAnimationFrame( () => {
      this._calculateWidth();
    })
  }

  /**
   * Re-calculates lightbox width based upon scroll position. Lightbox is 80% of viewport at top of document, 30% width of original 80% at bottom
   */
  _calculateWidth() {
    let html = document.documentElement;
    let body = document.body;
    let lightbox = document.querySelector('.lightbox');

    // viewport height
    let clientHeight = html.clientHeight;

    // document height (as set by css) 
    let documentHeight = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);

    // measurement of body's total css height.
    let pageHeight = document.documentElement.offsetHeight;

    // interior height of the window in pixels
    let windowHeight = window.innerHeight;

    // does the same thing as html.scrollTop, more universal browser support
    let scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

    let documentWindowTopHeight = documentHeight - windowHeight;
    
    let dynamicSize = (window.innerWidth * .80) * (1 - (scrollPosition / documentWindowTopHeight));
    lightbox.style.width = `${dynamicSize}px`;

    if (! (pageHeight <= windowHeight+scrollPosition) || (lightbox.style.width <= window.innerWidth*.33)) {
      lightbox.style.width = dynamicSize;
    }
  }
}



// UI Class - Handles Lightbox UI
  // Event: Display data from XHR Requests
class UI { 
  static displayLightBox() {
    async function getData() {
      const ENDPOINT = 'http://homework.warbyparker.com';
      const RESTClient = new RESTService();
    
      try {
        let response = await RESTClient.get(ENDPOINT);

        UI.renderLightBox(response);

      } catch(error) {
        console.log('RESTService error. How are you gentlepeople !! All your base are belong to us: ', error);
      }
    }
    getData();
    UI.setLightBoxWidth();
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

  static setLightBoxWidth() {
    let lightbox = document.querySelector('.lightbox');
    lightbox.style.width = `${window.innerWidth * .80}px`;
  }
}
  
// Event: Display data from XHR Requests
document.addEventListener('DOMContentLoaded', UI.displayLightBox);

const myUI = new UI();
const myScroll = new ScrollService();