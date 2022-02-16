const guestbook = (function() {

  // Configure
  let currentPage = 0;
  let pageLimit = 10;

  // Cache dom
  const templates = {
    guestbookHeading: document.querySelector('#js-template__guestbook-heading'),
    guestbookEntry: document.querySelector('#js-template__guestbook-entry'),
    seperator: document.querySelector('#js-template__seperator')
  }
  const guestbook = {
    content: document.querySelector('#js-guestbook__content'),
    throbber: document.querySelector('#js-guestbook__throbber'),
    failedMessage: document.querySelector('#js-guestbook__failed-message')
  }
  // Init values
  let prevMonthYear; // Init tracking for headers

  // Defines classes
  class GuestbookEntry {
    constructor(name, location, date, comment) {
      this.template = templates.guestbookEntry.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-guestbook-entry'),
        name: this.template.querySelector('.js-guestbook-entry__name'),
        location: this.template.querySelector('.js-guestbook-entry__location'),
        date: this.template.querySelector('.js-guestbook-entry__date'),
        comment: this.template.querySelector('.js-guestbook-entry__comment')
      }
      // Render
      this.nodes.name.innerHTML = name;
      this.nodes.location.innerHTML = location;
      this.nodes.date.innerHTML = date;
      this.nodes.comment.innerHTML = comment;
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  class GuestbookHeading {
    constructor(date) {
      this.template = templates.guestbookHeading.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('#js-guestbook-heading')
      }
      // Render
      this.nodes.root.innerHTML = date;
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  class Seperator {
    constructor() {
      this.template = templates.seperator.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-seperator')
      }
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  // Bind events
  init();
  events.on('pageScroll:bottom', getEntriesPage);

  // Behaviour
  function init() {
    events.emit('scrollHandler:start');
    guestbook.failedMessage.classList.add('u-hidden');
    getEntriesPage();
  }

  function getEntriesPage() {
    guestbook.throbber.classList.remove('u-hidden'); // Start loading animation
    events.emit('scrollHandler:stop'); // Prevent function getting called again from scroll events

    fetch(`/api/guestbook/?page=${currentPage}&limit=${pageLimit}`)
    .then(response => response.json())
    .then(response => {
      const { guestbookEntries, count } = response;
      const fragment = document.createDocumentFragment();

      guestbookEntries.forEach(entry => {
        const { name, location, date, comment } = entry;
        // When handling a new month insert header to fragment
        let currentMonthYear = moment(date).format('MMMM YYYY');
        if (currentMonthYear != prevMonthYear) {
          new GuestbookHeading(currentMonthYear).appendTo(fragment);
          new Seperator().appendTo(fragment);
          prevMonthYear = currentMonthYear;
        }
        // Insert guestbook entry to fragment
        new GuestbookEntry(
          name,
          location,
          moment(date).format("dddd Do MMMM"),
          comment
        ).appendTo(fragment);
        // Insert seperator to fragment
        new Seperator().appendTo(fragment);
        // Then insert fragment to DOM
        guestbook.content.append(fragment);
      });
      guestbook.throbber.classList.add('u-hidden'); // Stop loading animation

      // increment current page and restart scroll events if more guestbook entries are potentially available
      if (count == pageLimit) {
        currentPage++;
        events.emit('scrollHandler:start');
      }
      else {
        guestbook.failedMessage.innerHTML = 'No more guestbook entries are available';
        guestbook.failedMessage.classList.remove('u-hidden');
      }
    })
    .catch(error => {
      console.error(error);
      guestbook.throbber.classList.add('u-hidden'); // Stop loading animation
      guestbook.failedMessage.classList.remove('u-hidden');
    });
  }

})();