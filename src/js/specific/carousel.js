// Carousels V2
var carousels = (function() {
  // Define carousel class
  class Carousel {
    constructor(container) {
      this.container = container;
      this.slides = container.querySelectorAll('.js-carousel__slide');;
      this.indicators = container.querySelectorAll('.js-carousel__indicator');
      this.buttons = {
        prev: container.querySelector('.js-carousel__button--previous'),
        next: container.querySelector('.js-carousel__button--next')
      }
      this.currentSlide = 0;
      this.totalSlides = this.slides.length - 1;
    }
    // Logic
    firstSlideSelected = () => this.currentSlide === 0;
    lastSlideSelected = () => this.currentSlide === this.totalSlides;
    // Behaviour
    prevSlide() {
      console.log('previous slide');
      this.firstSlideSelected() ? this.currentSlide = this.totalSlides : this.currentSlide--;
      this.render();
    }
    nextSlide() {
      console.log('next slide');
      this.lastSlideSelected() ? this.currentSlide = 0 : this.currentSlide++;
      this.render();
    }
    render() {
      console.log(`rendering slide: ${this.currentSlide}`);
      this.slides.forEach(slide => slide.classList.remove(activeClass.slide));
      this.slides[this.currentSlide].classList.add(activeClass.slide);
      this.indicators.forEach(indicator => indicator.classList.remove(activeClass.indicator));
      this.indicators[this.currentSlide].classList.add(activeClass.indicator);
    }
  }

  // Cache DOM
  const carousels = document.querySelectorAll('.js-carousel');
  let carouselArray = [];
  carousels.forEach(function(carousel) {
    let newCarousel = new Carousel(carousel);
    // Bind events
    newCarousel.buttons.prev.addEventListener('click', () => { newCarousel.prevSlide(); });
    newCarousel.buttons.next.addEventListener('click', () => { newCarousel.nextSlide(); });
    carouselArray.push(newCarousel);
  });

  // CSS active classes
  const activeClass = {
    slide: 'js-carousel__slide--active',
    indicator: 'js-carousel__indicator--active'
  }

  // return carouselArray;
})();





// Carousels V1
var carousels = (function() {
  carouselList = document.querySelectorAll('.js-carousel');
  // Cache DOM
  carouselList.forEach(function(e) {
    e.slides = e.querySelectorAll('.js-carousel__slide');
    e.indicators = e.querySelectorAll('.js-carousel__indicator');
    // Controls
    e.buttons = {
      previous: e.querySelector('.js-carousel__button--previous'),
      next: e.querySelector('.js-carousel__button--next')
    }
    // Configure
    e.settings = {
      currentSlide: 1,
      totalSlides: e.slides.length
    }
    // Bind Events
    e.buttons.previous.addEventListener('click', previousSlide);
    e.buttons.next.addEventListener('click', nextSlide);
    // Behaviour
    function nextSlide() {
      console.log('next slide');
      if (e.settings.currentSlide < e.settings.totalSlides) {
        e.settings.currentSlide++
      } else {
        e.settings.currentSlide = 1;
      }
      render();
    }
   function previousSlide() {
      console.log('previous slide');
      if (e.settings.currentSlide > 1) {
        e.settings.currentSlide--
      } else {
        e.settings.currentSlide = e.settings.totalSlides;
      }
      render();
    }
    function render() {
      console.log('rendering');
      console.log('current slide: ' + e.settings.currentSlide);
      let classActiveSlide = 'js-carousel__slide--active';
      let classActiveIndicator = 'js-carousel__indicator--active';
      // Update display
      e.slides.forEach(function(e) { 
        e.classList.remove(classActiveSlide);
      });
      e.slides[(e.settings.currentSlide - 1)].classList.add(classActiveSlide);
      // update nav
      e.indicators.forEach(function(e) {
        e.classList.remove(classActiveIndicator);
      });
      e.indicators[(e.settings.currentSlide - 1)].classList.add(classActiveIndicator);
    }
  });
})();