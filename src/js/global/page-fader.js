var pageFader = (function() {
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