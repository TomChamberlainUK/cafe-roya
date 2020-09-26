var scrollUtility = (function() {
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