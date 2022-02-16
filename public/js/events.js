const eventCards = (function() {

  // Cache dom
  const templates = {
    eventCard: document.querySelector('#js-template__event-card'),
    eventsHeading: document.querySelector('#js-template__events-heading')
  }
  const content = document.querySelector('#js-events__content');
  const throbber = document.querySelector('#js-events__throbber');
  const failedMessage = document.querySelector('#js-events__failed-message');

  // Configure
  let prevMonthYear; // Init tracking for events headings

  // Define classes
  class EventCard {
    constructor(name, description, startTime, endTime, id, imagePath) {
      this.template = templates.eventCard.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-event-card'),
        name: this.template.querySelector('.js-event-card__name'),
        description: this.template.querySelector('.js-event-card__description'),
        date: this.template.querySelector('.js-event-card__date'),
        startTime: this.template.querySelector('.js-event-card__start-time'),
        endTime: this.template.querySelector('.js-event-card__end-time'),
        image: this.template.querySelector('.js-event-card__image'),
        facebookLink: this.template.querySelector('.js-event-card__facebook-link')
      }
      // Render
      this.nodes.name.innerHTML = name;
      this.nodes.name.href = `https://www.facebook.com/events/${id}/`;
      this.nodes.description.innerHTML = description;
      this.nodes.date.innerHTML = moment(startTime).format('dddd Do MMMM');
      this.nodes.startTime.innerHTML = moment(startTime).format('HH:mm');
      this.nodes.endTime.innerHTML = moment(endTime).format('HH:mm');
      this.nodes.image.src = imagePath;
      this.nodes.facebookLink.href = `https://www.facebook.com/events/${id}/`;
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  class EventsHeading {
    constructor(date) {
      this.template = templates.eventsHeading.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-events-heading')
      }
      // Render
      this.nodes.root.innerHTML = date;
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    // Start loading animation
    failedMessage.classList.add('u-hidden');
    throbber.classList.remove('u-hidden');
    // Fetch events
    fetch('/api/events')
    .then(response => response.json())
    .then(response => {
      if (response.error) throw 'Failed to fetch events from Facebook';
      renderEvents(response.data);
    })
    .catch(error => {
      console.error(error);
      // Show load error message
      throbber.classList.add('u-hidden');
      failedMessage.classList.remove('u-hidden');
    });
  }

  function renderEvents(events) {
    if (!events || !events.length) return;
    // Init fragment
    const fragment = document.createDocumentFragment();
    // sort chronologically and add each event to fragment
    events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .forEach(event => {
      const { name, description, start_time, end_time, id } = event;
      const imagePath = event.cover.source;
      // When handling a new month insert heading to fragment
      let currentMonthYear = moment(start_time).format('MMMM YYYY');
      if (currentMonthYear != prevMonthYear) {
        new EventsHeading(currentMonthYear).appendTo(fragment);
        prevMonthYear = currentMonthYear;
      }
      // Add event card to fragment
      new EventCard(
        name,
        description,
        start_time,
        end_time,
        id,
        imagePath
      ).appendTo(fragment);
    });
    // Render fragment and stop loading animation
    content.append(fragment);
    throbber.classList.add('u-hidden');
  }
})();