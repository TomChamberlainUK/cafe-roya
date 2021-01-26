const menu = (function() {
  // Cache DOM
  const templates = {
    menuEntry: document.querySelector('#js-template__menu-entry'),
    seperator: document.querySelector('#js-template__seperator')
  }
  const menu = {
    starters: document.querySelector('#js-menu__starters'),
    mains: document.querySelector('#js-menu__mains'),
    desserts: document.querySelector('#js-menu__desserts'),
  }
  const loader = {
    content: document.querySelector('#js-menu__content'),
    throbber: document.querySelector('#js-menu__throbber'),
    failedMessage: document.querySelector('#js-menu__failed-message')
  }
  // Configure

  // Define classes
  class MenuEntry {
    constructor(name, description, dietaryOptions) {
      this.template = templates.menuEntry.content.cloneNode(true);
      this.nodes = {
        root: this.template.querySelector('.js-menu-entry'),
        name: this.template.querySelector('.js-menu-entry__name'),
        description: this.template.querySelector('.js-menu-entry__description'),
        dietaryOptions: this.template.querySelector('.js-menu-entry__dietaryOptions')
      }
      // Render
      this.nodes.name.innerHTML = name;
      this.nodes.description.innerHTML = description;
      this.nodes.dietaryOptions.innerHTML = dietaryOptions;
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

  // Behaviour
  function init() {
    fetch('http://192.168.0.69:3000/api/menu/date/2020-10-15')
    .then(response => response.json())
    .then(response => {
      if (!response.exists) {
        console.error('Menu fetch request failed: No available menu for current month');
        showNoMenuMessage();
      }
      else {
        const { starters, mains, desserts } = response;
        // Populate document fragments and add to dom
        const startersFragment = buildCourseDocumentFragment(starters);
        const mainsFragment = buildCourseDocumentFragment(mains);
        const dessertsFragment = buildCourseDocumentFragment(desserts);
        menu.starters.append(startersFragment);
        menu.mains.append(mainsFragment);
        menu.desserts.append(dessertsFragment);
        showMenuContent();
      }
    })
    .catch(error => {
      console.error(error);
      showNoMenuMessage();
    });
  }

  function parseDietaries(array) {
    if (!array.length) return '';
    let string = '';
    if (array.includes('vegan')) string += 'VO ';
    if (array.includes('glutenFree')) string += 'GFO ';
    if (array.includes('nutFree')) string += 'NFO ';
    return string;
  }

  function buildCourseDocumentFragment(dishes) {
    const fragment = document.createDocumentFragment();

    dishes.forEach((dish, i) => {
      new MenuEntry(
        dish.name,
        dish.description,
        parseDietaries(dish.dietaryOptions)
      )
      .appendTo(fragment);
      // Insert seperator if not last element
      if (i + 1 < dishes.length)
        new Seperator().appendTo(fragment);
    });
    return fragment;
  }

  function showNoMenuMessage(message) {
    const { content, failedMessage, throbber } = loader;
    if (message)
      failedMessage.innerHTML = message;
    throbber.classList.add('u-hidden');
    content.classList.add('u-hidden');
    failedMessage.classList.remove('u-hidden');
  }

  function showMenuContent() {
    const { content, failedMessage, throbber } = loader;
    throbber.classList.add('u-hidden');
    failedMessage.classList.add('u-hidden');
    content.classList.remove('u-hidden');
  }
})();