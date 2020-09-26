var navigation = (function() {
  // Cache DOM
  const navigation = document.querySelector('#js-navigation');
  const buttons = document.querySelectorAll('.js-menu-btn');
  const openClass = 'c-navigation--open';
  // Configure
  var settings = {
    open: false
  }
  // Bind Events
  buttons.forEach(function(e) {
    e.addEventListener('click', toggle);
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