console.log('app.js');

// REST Service Class - Handles XHR requests
  // use XHR to make request
  // only GET method needed
  // return promise for async handling

const getData = () => {
  const xhr = new XMLHttpRequest();

  const ENDPOINT = 'https://jsonplaceholder.typicode.com/todos/1';

  xhr.open('GET', ENDPOINT);

  xhr.onload = () => {
    const data = JSON.parse(xhr.response);
    console.log(data);
  }

  xhr.send();
}

getData();


// Scroll Service Class - Listens and Changes size of lightbox on Scroll
  // listen for scroll Event
  // onScroll handler - calculate new width of div

// UI Class - Handles Lightbox UI
  // Event: Display data from XHR Requests

