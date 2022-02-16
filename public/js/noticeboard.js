(function() {
  // Cache dom
  const templates = {
    noticeboardCard: document.querySelector('#js-template__noticeboard-card'),
    galleryCard: document.querySelector('#js-templates__gallery-card'),
    eventCard: document.querySelector('#js-templates__event-card')
  }
  const noticeboard = new Colcade( '.js-masonry-grid', {
    columns: '.js-masonry-grid__column',
    items: '.js-masonry-grid__item'
  });
  const loader = {
    content: document.querySelector('#js-noticeboard__content'),
    throbber: document.querySelector('#js-noticeboard__throbber'),
    failedMessage: document.querySelector('#js-noticeboard__failed-message')
  }

  // Defines classes
  class PageCard {
    constructor(params) {
      const { name, heading, body, link } = params;
      this.template = templates.noticeboardCard.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-noticeboard-card'),
        heading: this.template.querySelector('.js-noticeboard-card__heading'),
        subheading: this.template.querySelector('.js-noticeboard-card__subheading'),
        body: this.template.querySelector('.js-noticeboard-card__body'),
        pageLink: this.template.querySelector('.js-noticeboard-card__page-link')
      }
      // Render
      this.nodes.heading.innerHTML = name;
      this.nodes.heading.href = link;
      this.nodes.subheading.innerHTML = heading;
      this.nodes.body.innerHTML = body;
      this.nodes.pageLink.innerHTML = `View ${name}`;
      this.nodes.pageLink.href = link;
    }
    
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  class GalleryCard {
     constructor(params) {
      const { path, description } = params;
      this.template = templates.galleryCard.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-noticeboard-gallery-card'),
        image: this.template.querySelector('.js-noticeboard-gallery-card__image')
      }
      // Render
      this.nodes.image.src = `/${path}`;
      if (description) // Set alt if applicable
        this.nodes.image.alt = description;
     }

     appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  class EventCard {
    constructor(params) {
      const { name, description, startTime, endTime, id, imagePath } = params
      this.template = templates.eventCard.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-noticeboard-event-card'),
        name: this.template.querySelector('.js-noticeboard-event-card__name'),
        description: this.template.querySelector('.js-noticeboard-event-card__description'),
        date: this.template.querySelector('.js-noticeboard-event-card__date'),
        startTime: this.template.querySelector('.js-noticeboard-event-card__start-time'),
        endTime: this.template.querySelector('.js-noticeboard-event-card__end-time'),
        image: this.template.querySelector('.js-noticeboard-event-card__image'),
        facebookLink: this.template.querySelector('.js-noticeboard-event-card__facebook-link')
      }
      // Render
      this.nodes.name.innerHTML = name;
      this.nodes.description.innerHTML = description;
      this.nodes.date.innerHTML = moment(startTime).format('dddd Do MMMM');
      this.nodes.startTime.innerHTML = moment(startTime).format('HH:mm');
      this.nodes.endTime.innerHTML = moment(endTime).format('HH:mm');
      this.nodes.name.href = `https://www.facebook.com/events/${id}/`;
      this.nodes.image.src = imagePath;
      this.nodes.facebookLink.href = `https://www.facebook.com/events/${id}/`;
    }

    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    // Get gallery images
    Promise.allSettled([
      fetch(`/api/gallery/?limit=3`).then(response => response.json()),
      fetch('/api/events').then(response => response.json())
    ])
    .then(response => {
      const imagesResponse = response[0].value;
      const eventsResponse = response[1].value;
      let images, events;
      const fragment = document.createDocumentFragment();

      if (imagesResponse.error) {
        console.warn('Failed to fetch noticeboard images.');
      } else {
        images = imagesResponse.images;
      }

      if (eventsResponse.error) {
        console.warn('Failed to fetch noticeboard events from Facebook.');
      } else if (eventsResponse.data && eventsResponse.data.length) {
        events = eventsResponse.data.sort((a, b) => new Date(a.start_time) - new Date (b.start_time)); // sort events chronologically
      }
      
      new PageCard({
        name: 'Menu',
        heading: 'Check out our current menu for November!',
        body: 'We update our menu each and every month to keep our recipes fresh and seasonal. You can check out some of our current mains below, or see our whole menu here',
        link: 'menu.html'
      }).appendTo(fragment);

      if (events && events[0]) {
        new EventCard({
          name: events[0].name,
          description: events[0].description,
          startTime: events[0].start_time,
          endTime: events[0].end_time,
          id: events[0].id,
          imagePath: events[0].cover.source
        }).appendTo(fragment);
      }
  
      if (images && images[0]) {
        new GalleryCard({
          path: images[0].path,
          description: images[0].description
        }).appendTo(fragment);
      }
  
      new PageCard({
        name: 'Events',
        heading: 'Got a free Sunday coming up in your calendar?',
        body: 'We regularly host exciting events with some of our local partners. Whether its live-music, tequila-tasting, or our classic Persian brunch—there’s something for everyone, every week, at Café Roya.',
        link: 'events.html'
      }).appendTo(fragment);
      
      if (events && events[1]) {
        new EventCard({
          name: events[1].name,
          description: events[1].description,
          startTime: events[1].start_time,
          endTime: events[1].end_time,
          id: events[1].id,
          imagePath: events[1].cover.source
        }).appendTo(fragment);
      }
      
      if (images && images[1]) {
        new GalleryCard({
          path: images[1].path,
          description: images[1].description
        }).appendTo(fragment);
      }
      
      new PageCard({
        name: 'Gallery',
        heading: 'Fancy a tour of the restaurant?',
        body: 'Or perhaps you’d like to peruse some of our dishes? Have a scroll through our image gallery—though we can’t promise that it won’t whet your appetite…',
        link: 'gallery.html'
      }).appendTo(fragment);

      if (events && events[2]) {
        new EventCard({
          name: events[2].name,
          description: events[2].description,
          startTime: events[2].start_time,
          endTime: events[2].end_time,
          id: events[2].id,
          imagePath: events[2].cover.source
        }).appendTo(fragment);
      }
      
      if (images && images[2]) {
        new GalleryCard({
          path: images[2].path,
          description: images[2].description
        }).appendTo(fragment);
      }
      
      new PageCard({
        name: 'Guestbook',
        heading: 'Planning a meal with us soon?',
        body: 'Be sure to leave a comment in our guestbook whilst you’re here! We love hearing from our fellow food enthusiasts from all over the world. See what some of our other patrons have had to say below.',
        link: 'guestbook.html'
      }).appendTo(fragment);

      // Hide throbber and show content
      loader.throbber.classList.add('u-hidden');
      loader.content.classList.remove('u-hidden');
      noticeboard.append(fragment);

    }).catch(error => {
      // Hide throbber and show error
      loader.throbber.classList.add('u-hidden');
      loader.failedMessage.classList.remove('u-hidden');
      console.error(error);
    });

  }
})();