// Helper functions

function render(template, node) {
  if (!node) return;
  node.innerHTML = template;
}

// AJAX XML HTTP requests
const makeRequest = function(url, method) {
  
  // Create XHR request object
  let xhr = new XMLHttpRequest();

  // Return as promise
  return new Promise(function(resolve, reject) {

    // POTENTIAL LOADING FUNCTIONALITY
    // xhr.onprogress = function() {}
    
    xhr.onload = function() {
      // Process response
      if (this.status >= 200 && this.status < 300) {
        // Successful
        resolve(this.responseText);
      } else {
        // Failed
        reject({
          status: this.status,
          statusText: this.statusText
        });
      }
    }

    // Setup HTTP request
    xhr.open(method || 'GET', url, true);

    // Send request
    xhr.send();

  });  
}

const getRandomInteger = function(min, max) {

  if (min < max) {
    let number = Math.random() * (max - min + 1) + min;
    let integer = Math.floor(number);
    return integer;
  } else {
    console.log('Get random integer error: Minimum value cannot be larger than or equal to maximum value.');
    return;
  }
  
}

const getRandomArrayItem = function(array) {

  if (Array.isArray(array)) {
    let item = array[getRandomInteger(0, (array.length - 1))];
    return item;
  } else {
    console.log('Get random array item error: argument is not an array.', array);
    return;
  } 

}

const formatDate = function(date) {

  // Parse Date
  let dateParts = date.split("-");
  let [year, month, day] = [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])];

  // Convert month integer to name
  function formatMonth(month) {
    const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthArray[month - 1]; 
  }

  // Add suffix to day
  function formatDay(day) {
    const suffix = (function() {
      if (day % 10 == 1 && day !== 11) {
        return 'st';
      } else if (day % 10 == 2 && day !== 12) {
        return 'nd';
      } else if (day % 10 == 3 && day !== 13) {
        return 'rd';
      } else {
        return 'th';
      }
    })();
    return `${day}${suffix}`;
  }

  return `${formatDay(day)} ${formatMonth(month)} ${year}`;

}