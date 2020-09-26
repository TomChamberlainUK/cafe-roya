const databaseEvents = (function() {
  // Give better naming and makes this module less confusing

    getData('/api/guestbook/', 'guestbook', 'loaded-guestbook');
    getData('/api/menu/', 'menu', 'loaded-menu');

    // function checkData(url, keyName, eventName) {
    //   if (sessionStorage[keyName]) {
    //     const sessionData = JSON.parse(sessionStorage[keyName]);
    //     // Check that data is up to date
    //     if (moment(sessionData.timestamp).isAfter(moment().startOf('day').format())) {
    //       // If so, unpackage and emit events + data
    //       // console.log(`${keyName} data successfully loaded from client.`, sessionData);
    //       events.emit(eventName, sessionData.data);
    //       return;
    //     } else {
    //       // If not make database request
    //       // console.log(`Client ${keyName} data outdated.`);
    //       getData(url, keyName, eventName);
    //       return;
    //     }
    //   } else {
    //     // If session data does not exist make database request
    //     // console.log(`Client ${keyName} data does not exist.`);
    //     getData(url, keyName, eventName);
    //     return;
    //   }
    // }

    // Sends GET request to API, saves response under keyName, then triggers eventName passing response as argument
    function getData(url, keyName, eventName) {
      makeRequest(url)
        // If successful
        .then(function(data) {
          data = JSON.parse(data);
          // console.log(keyName + ' data successfully loaded from server and saved locally.', data);
          events.emit(eventName, data);
          cacheToSession(keyName, data);
        })
        .catch(function(error) {
          // console.log('Server request failed.', error);
        });
    }

    // function cacheToSession(keyName, data) {
    //   const sessionData = {
    //     data: data,
    //     timestamp: moment()
    //   }
    //   sessionStorage.setItem(keyName, JSON.stringify(sessionData));
    // }
})();