const customerComment = (function() {

  // Cache DOM
  const commentCard = { container: document.querySelector('.js-comment-card') };
    commentCard.comment = commentCard.container.querySelector('.js-comment-card__comment');
    commentCard.name = commentCard.container.querySelector('.js-comment-card__name');
    commentCard.date = commentCard.container.querySelector('.js-comment-card__date');

  // Bind events
  events.on('loaded-guestbook', render);

  // Behaviour
  function render(guestbookData) {
    let entry = getRandomArrayItem(guestbookData.guestbookEntries);
    entry.date = formatDate(entry.date);
    commentCard.comment.innerHTML = entry.comment;
    commentCard.name.innerHTML = entry.name;
    commentCard.date.innerHTML = entry.date;
  }

})();




const navigation = (function() {

  // Cache DOM
  const navigation = document.querySelector('#js-navigation');
  const buttons = document.querySelectorAll('.js-menu-btn');
  const openClass = 'c-navigation--open';

  // Configure
  var settings = {
    open: false
  }

  // Bind Events
  buttons.forEach(function(button) {
    button.addEventListener('click', toggle);
  });
  events.on('page-fader-clicked', close);

  // Behaviour
  function toggle() {
    if (settings.open) {
      close();
    } else {
      open();
    }
  }

  function open() {
    console.log('navigation opened');
    navigation.classList.add(openClass);
    settings.open = true;
    events.emit('navigation-opened');
  }

  function close() {
    console.log('navigation closed');
    navigation.classList.remove(openClass);
    settings.open = false;
    events.emit('navigation-closed');
  }

})();




const scrollUtility = (function() {
  // Cache DOM
  const body = document.querySelector('body');
  const preventScrollClass = 'u-prevent-scroll';

  // Configure
  var settings = {
    allowScroll: true
  }

  // Bind Events
  events.on('navigation-opened', preventScroll);
  events.on('navigation-closed', allowScroll);

  // Behaviour
  function preventScroll() {
    console.log('scrolling disabled');
    body.classList.add(preventScrollClass);
    settings.allowScroll = false;
  }

  function allowScroll() {
    console.log('scrolling enabled');
    body.classList.remove(preventScrollClass);
    settings.allowScroll = true;
  }

})();




const pageFader = (function() {

  // Cache DOM
  const pageFader = document.querySelector('.js-page-fader');
  const activeClass = 'js-page-fader--active';

  // Configure
  let settings = {
    active: false
  }

  // Bind events
  events.on('navigation-opened', activate);
  events.on('navigation-closed', deactivate);
  pageFader.addEventListener('click', faderClicked);

  // Behaviour
  function activate() {
    pageFader.classList.add(activeClass);
    settings.active = true;
  }

  function deactivate() {
    pageFader.classList.remove(activeClass);
    settings.active = false;
  }

  function faderClicked() {
    console.log('page-fader clicked');
    events.emit('page-fader-clicked');
  }

})();