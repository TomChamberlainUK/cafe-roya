const gallery = (function() {

  // Configure
  let currentPage = 0;
  let pageLimit = 5;

  // Cache DOM
  const templates = {
    galleryImage: document.querySelector('#js-template__gallery-card')
  }
  const gallery = {
    content: document.querySelector('#js-gallery__content'),
    throbber: document.querySelector('#js-gallery__throbber'),
    failedMessage: document.querySelector('#js-gallery__failed-message')
  }

  // Define classes
  class GalleryImage {
    constructor(path, description) {
      this.template = templates.galleryImage.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-gallery-card'),
        image: this.template.querySelector('.js-gallery-card__image')
      }
      // Render
      this.nodes.image.src = `http://192.168.0.69:3000/${path}`;
      if (description) // Set alt if applicable
        this.nodes.image.alt = description;
    }
    appendTo(target) {
      target.append(this.nodes.root);
    }
  }

  // Bind events
  init();
  events.on('pageScroll:bottom', getImagesPage);

  // Behaviour
  function init() {
    events.emit('scrollHandler:start');
    gallery.failedMessage.classList.add('u-hidden');
    gallery.throbber.classList.remove('u-hidden'); // Start loading animation
    getImagesPage();
  }

  function getImagesPage() {
    gallery.throbber.classList.remove('u-hidden'); // Start loading animation
    events.emit('scrollHandler:stop'); // Prevent function getting called again from scroll events

    fetch(`http://192.168.0.69:3000/api/gallery/?page=${currentPage}&limit=${pageLimit}`)
    .then(response => response.json())
    .then(response => {
      const { images, count } = response;
      const fragment = document.createDocumentFragment();

      images.forEach(image => {
        const { path, description } = image;
        new GalleryImage(path, description).appendTo(fragment);
      });
      gallery.content.append(fragment);
      gallery.throbber.classList.add('u-hidden'); // Stop loading animation

      // increment current page and restart scroll events if more images are potentially available
      if (count == pageLimit) {
        currentPage++;
        events.emit('scrollHandler:start');
      }
    })
    .catch(error => {
      console.error(error)
      gallery.throbber.classList.add('u-hidden'); // Stop loading animation
      gallery.failedMessage.classList.remove('u-hidden');
    });
  }
})();