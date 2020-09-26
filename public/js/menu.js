const makeRequestTest = (url, method, data) => {

  let xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {

    // Validate parameters
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(method)) {
      return reject({
        status: 400,
        statusText: `Method: ${method} is not a valid method.`
      });
    } else if ((['POST', 'PATCH'].includes(method)) && !data) {
      return reject({
        status: 400,
        statusText: `POST and PATCH requests require data parameter.`
      });
    }

    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Successful
        resolve(xhr.response);
      } else {
        // Failed
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    }

    // Setup HTTP request
    xhr.open(method, url);

    if (method == 'POST' || method == 'PATCH') {
      // Set content-type to JSON if applicable
      xhr.setRequestHeader('Content-Type', 'application/JSON');
      // Send request with data
      xhr.send(data);
    } else {
      // Send request
      xhr.send();
    }

  });
}





const menu = (() => {
  // Cache DOM
  const menu = document.querySelector('.js-menu');
  menu.elements = {
    starters: menu.querySelector('.js-menu__starters'),
    mains: menu.querySelector('.js-menu__mains'),
    desserts: menu.querySelector('.js-menu__desserts')
  }

  const templates = {
    dish: document.querySelector('#js-templates__dish')
  }

  // Declare classes
  class Dish {
    constructor(name, description, dietaryOptions) {
      this.template = templates.dish.content.cloneNode(true);
      this.elements = {
        root: this.template.querySelector('.js-menu__dish'),
        name: this.template.querySelector('.js-menu__dish-name'),
        description: this.template.querySelector('.js-menu__dish-description'),
        dietaryOptions: this.template.querySelector('.js-menu__dish-dietaryOptions')
      }
      // Render
      this.elements.name.innerHTML = name;
      this.elements.description.innerHTML = description;
      this.elements.dietaryOptions.innerHTML = (() => {
        let string = '';
        if (dietaryOptions.includes('vegan')) string+= 'VO ';
        if (dietaryOptions.includes('glutenFree')) string+= 'GFO ';
        if (dietaryOptions.includes('nutFree')) string+= 'NFO ';
        if (!string.length) string = ' ';
        return string;
      })();
    }
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    // loadingAnimation.start(menu);
    makeRequestTest('http://localhost:3000/api/menu/current', 'GET')
    .then(response => {
      response = JSON.parse(response);

      const fragments = {
        starters: document.createDocumentFragment(),
        mains: document.createDocumentFragment(),
        desserts: document.createDocumentFragment()
      }

      response.dishes.forEach(dish => {
        const newDish = new Dish(dish.name, dish.description, dish.dietaryOptions);
        switch (dish.course) {
          case 'starter':
            fragments.starters.append(newDish.elements.root);
            break;
          case 'main':
            fragments.mains.append(newDish.elements.root);
            break;
          case 'dessert':
            fragments.desserts.append(newDish.elements.root);
            break;
          default:
            console.log('Failed to allocate dish to course', dish);
        }
      });

      menu.elements.starters.append(fragments.starters);
      menu.elements.mains.append(fragments.mains);
      menu.elements.desserts.append(fragments.desserts);
      // loadingAnimation.stop(menu);
    })
    .catch(error => {
      console.log(error)
      // loadingAnimation.stop(menu);
    });
  }
})();