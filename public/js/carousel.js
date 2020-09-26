// Carousels
const carousels = (function() {

  // Cache DOM
  const carousels = document.querySelectorAll('.js-carousel');

  // Define class
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
    prevSlide() {
      console.log('previous slide');
      if (this.currentSlide === 0) {
        this.currentSlide = this.totalSlides;
      } else {
        this.currentSlide--;
      }
      this.render();
    }
    nextSlide() {
      console.log('next slide');
      if (this.currentSlide === this.totalSlides) {
        this.currentSlide = 0;
      } else {
        this.currentSlide++;
      }
      this.render();
    }
    render() {
      this.slides.forEach(slide => slide.classList.remove(activeClass.slide));
      this.slides[this.currentSlide].classList.add(activeClass.slide);
      this.indicators.forEach(indicator => indicator.classList.remove(activeClass.indicator));
      this.indicators[this.currentSlide].classList.add(activeClass.indicator);
    }
  }

  // Behaviour
  carousels.forEach(function(carousel) {
    let newCarousel = new Carousel(carousel);
    // Bind events
    newCarousel.buttons.prev.addEventListener('click', () => { newCarousel.prevSlide(); });
    newCarousel.buttons.next.addEventListener('click', () => { newCarousel.nextSlide(); });
  });

  // CSS active classes
  const activeClass = {
    slide: 'js-carousel__slide--active',
    indicator: 'js-carousel__indicator--active'
  }
})();


// // Carousels
// const carousels = (function() {
//   // Define carousel class
//   class Carousel {
//     constructor(container) {
//       this.container = container;
//       this.slides = container.querySelectorAll('.js-carousel__slide');;
//       this.indicators = container.querySelectorAll('.js-carousel__indicator');
//       this.buttons = {
//         prev: container.querySelector('.js-carousel__button--previous'),
//         next: container.querySelector('.js-carousel__button--next')
//       }
//       this.currentSlide = 0;
//       this.totalSlides = this.slides.length - 1;
//     }
//     // Logic
//     firstSlideSelected = () => this.currentSlide === 0;
//     lastSlideSelected = () => this.currentSlide === this.totalSlides;
//     // Behaviour
//     prevSlide() {
//       this.firstSlideSelected() ? this.currentSlide = this.totalSlides : this.currentSlide--;
//       this.render();
//     }
//     nextSlide() {
//       this.lastSlideSelected() ? this.currentSlide = 0 : this.currentSlide++;
//       this.render();
//     }
//     render() {
//       this.slides.forEach(slide => slide.classList.remove(activeClass.slide));
//       this.slides[this.currentSlide].classList.add(activeClass.slide);
//       this.indicators.forEach(indicator => indicator.classList.remove(activeClass.indicator));
//       this.indicators[this.currentSlide].classList.add(activeClass.indicator);
//     }
//   }

//   // Cache DOM
//   const carousels = document.querySelectorAll('.js-carousel');
//   carousels.forEach(function(carousel) {
//     let newCarousel = new Carousel(carousel);
//     // Bind events
//     newCarousel.buttons.prev.addEventListener('click', () => { newCarousel.prevSlide(); });
//     newCarousel.buttons.next.addEventListener('click', () => { newCarousel.nextSlide(); });
//   });

//   // CSS active classes
//   const activeClass = {
//     slide: 'js-carousel__slide--active',
//     indicator: 'js-carousel__indicator--active'
//   }
// })();