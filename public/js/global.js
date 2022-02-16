const pageHeader = (function() {
  // Cache DOM
  const htmlElement = document.querySelector('html');
  const navigation = document.querySelector('#js-navigation');
  const menuBtn = document.querySelector('#js-page-header__menu-btn');
  const sizingBtn = document.querySelector('#js-page-header__sizing-btn');

  // Configure
  const settings = {
    isOpen: false,
    accessibilityModeEnabled: JSON.parse(sessionStorage.getItem('accessibilityModeEnabled')) || false
  }

  // Bind Events
  init();
  
  // Behaviour
  function init() {
    events.on('modalMessage:opened', disable);
    events.on('modalMessage:closed', enable);
    events.on('pageFader:clicked', close);
    enable();
    if (settings.accessibilityModeEnabled)
      enableAccessibilityMode();
  }

  function enable() {
    menuBtn.addEventListener('click', toggleOpen);
    sizingBtn.addEventListener('click', toggleAccessibilityMode);
  }

  function disable() {
    menuBtn.removeEventListener('click', toggleOpen);
    sizingBtn.removeEventListener('click', toggleAccessibilityMode);
  }

  function toggleOpen() {
    settings.isOpen ? close() : open();
  }

  function toggleAccessibilityMode() {
    settings.accessibilityModeEnabled ? disableAccessibilityMode() : enableAccessibilityMode();
  }

  function open() {
    navigation.classList.add('c-navigation--open');
    settings.isOpen = true;
    events.emit('navigation:opened');
  }

  function close() {
    navigation.classList.remove('c-navigation--open');
    settings.isOpen = false;
    events.emit('navigation:closed');
  }

  function enableAccessibilityMode() {
    htmlElement.classList.add('u-accessibility-mode');
    settings.accessibilityModeEnabled = true;
    sessionStorage.setItem('accessibilityModeEnabled', JSON.stringify(true));
  }

  function disableAccessibilityMode() {
    htmlElement.classList.remove('u-accessibility-mode');
    settings.accessibilityModeEnabled = false;
    sessionStorage.setItem('accessibilityModeEnabled', JSON.stringify(false));
  }
})();


const pageFader = (function() {

  // Cache DOM
  const pageFader = document.querySelector('#js-page-fader');
  const body = document.querySelector('body');
  // Configure
  let settings = {
    active: false
  }

  // Bind events
  events.on('navigation:opened', activate);
  events.on('navigation:closed', deactivate);
  events.on('modalMessage:opened', activate);
  events.on('modalMessage:closed', deactivate);
  pageFader.addEventListener('click', faderClicked);

  // Behaviour
  function activate() {
    pageFader.classList.add('c-page-fader--active');
    body.classList.add('u-prevent-scroll');
    settings.active = true;
  }

  function deactivate() {
    pageFader.classList.remove('c-page-fader--active');
    body.classList.remove('u-prevent-scroll');
    settings.active = false;
  }

  function faderClicked() {
    events.emit('pageFader:clicked');
  }
})();



const commentCard = (function() {
  // Cache DOM
  const root = document.querySelector('#js-comment-card');
  const nodes = {
    comment: document.querySelector('#js-comment-card__comment'),
    name: document.querySelector('#js-comment-card__name'),
    location: document.querySelector('#js-comment-card__location')
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    const randomInt = Math.floor(Math.random() * 10);
    fetch(`/api/guestbook/?limit=1&page=${randomInt}`)
    .then(response => response.json())
    .then(response => {
      const { comment, name, location } = response.guestbookEntries[0];
      // Render
      nodes.comment.innerHTML = comment;
      nodes.name.innerHTML = name;
      nodes.location.innerHTML = location;
      root.classList.remove('u-hidden');
    })
    .catch(error => console.error(error))
  }
})();


const pageBanner = (function() {
  // Cache DOM
  const root = document.querySelector('#js-page-banner');
  const textContainer = root.querySelector('#js-page-banner__text-container');
  const textTemplate = root.querySelector('#js-page-banner__text-template');
  const exitBtn = root.querySelector('#js-page-banner__exit-btn');
  if (!root || !textContainer || !textTemplate || !exitBtn) return; // Failsafe
  // Configure
  let message, isActive;

  // Define classes
  class BannerMessage {
    constructor(message) {
      this.template = textTemplate.content.cloneNode(true);
      this.text = this.template.querySelector('.js-page-banner__text');
      this.text.innerHTML = message;
    }
    startAnimation() {
      const bannerMessage = this;
      const node = this.text; 
      const width = this.getWidth();
      let start;

      function step(timestamp) {
        if (!isActive) return;
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const distance = Math.round(0.04 * elapsed);
        setVendor(node, 'transform', `translate3d(-${distance}px, 0, 0)`);

        if (distance < width) // If still on screen
          window.requestAnimationFrame(step); // request next frame
        else { // If off screen, append on right and start animation again
          bannerMessage.appendTo(textContainer);
          bannerMessage.startAnimation();
        }
      }
      window.requestAnimationFrame(step);
    }
    appendTo(target) {
      target.append(this.text);
    }
    getWidth() {
      return this.text.offsetWidth;
    }
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    fetch('/api/config')
    .then(response => response.json())
    .then(response => {
      const { closingDates } = response;
      const currentDate = moment();
      if (currentDate > moment(closingDates.end) || currentDate < moment(closingDates.start).subtract(2, 'weeks'))
        return; // Do nothing if two weeks before holiday start or after holiday end
      const isOrWillBe = currentDate >= moment(closingDates.start) ? 'is currently' : 'will be';
      message = `Cafe Roya ${isOrWillBe} closed from the ${moment(closingDates.start).format('Do MMMM')} until the ${moment(closingDates.end).format('Do MMMM')}. ${closingDates.message}`;
      root.classList.remove('u-hidden');
      fillBanner();
      enable();
    })
    .catch(error => console.error(error));
    exitBtn.addEventListener('click', close);
  }

  function enable() {
    events.on('bannerMessage:new', addMessage);
    isActive = true;
  }

  function disable() {
    events.off('bannerMessage:new', addMessage);
    isActive = false;
  }

  function addMessage() {
    const newMessage = new BannerMessage(message);
    newMessage.appendTo(textContainer);
    newMessage.startAnimation();
    return newMessage;
  }

  function fillBanner() {
    const bannerWidth = textContainer.offsetWidth;
    newMessage = addMessage();
    let messageCount = bannerWidth / newMessage.getWidth();
    for (let i = 0; i < messageCount; i++)
      addMessage();
  }

  function refillBanner() {
    textContainer.innerHTML = "";
    fillBanner();
  }

  function close() {
    root.remove();
  }
})();




const scrollHandler = (function() {
  // This doesn't take into account footer size or anything else that takes up between bottom of doc and content loading
  // To do:
  // Make more precise

  // Bind events
  events.on('scrollHandler:start', initialize);
  events.on('scrollHandler:stop', terminate);

  // Behaviour
  function initialize() {
    document.addEventListener('scroll', throttledCheckScroll);
  }

  function terminate() {
    document.removeEventListener('scroll', throttledCheckScroll);
  }

  const throttledCheckScroll = throttle(checkScroll);

  function checkScroll() {
    const scrollDistance = window.pageYOffset;
    const pageHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    
    if (scrollDistance + windowHeight >= pageHeight - windowHeight) { // if scroll reaches 96px threshold of bottom of page
      events.emit('pageScroll:bottom');
    }
  }
})();