const openingTimes = (function() {
  // Cache dom
  const root = document.querySelector('#js-opening-times');
  const nodes = {
    content: root.querySelector('#js-opening-times__content'),
    error: root.querySelector('#js-opening-times__error'),
    day: {
      start: root.querySelector('#js-opening-times__days-start'),
      end: root.querySelector('#js-opening-times__days-end')
    },
    lunch: {
      start: root.querySelector('#js-opening-times__lunch-start'),
      end: root.querySelector('#js-opening-times__lunch-end')
    },
    dinner: {
      start: root.querySelector('#js-opening-times__dinner-start'),
      end: root.querySelector('#js-opening-times__dinner-end')
    }
  }

  // Bind events
  init();

  // Behaviour
  function init() {
    fetch('http://192.168.0.69:3000/api/config')
    .then(response => response.json())
    .then(response => {
      const { openingDays, lunchHours, dinnerHours } = response;
      // Render
      nodes.day.start.innerHTML = capitalize(openingDays.start);
      nodes.day.end.innerHTML = capitalize(openingDays.end);
      nodes.lunch.start.innerHTML = lunchHours.start;
      nodes.lunch.end.innerHTML = lunchHours.end;
      nodes.dinner.start.innerHTML = dinnerHours.start;
      nodes.dinner.end.innerHTML = dinnerHours.end;
      // Hide error fallback and show content
      nodes.error.classList.add('u-hidden');
      nodes.content.classList.remove('u-hidden');
      
    })
    .catch(error => console.error(error));
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
})();

const enquiryForm = (function() {
  // Configure
  const emailAddress = 'placeholder@email.com';

  // Define Classes
  class FormControl {
    constructor(props) {
      const { input } = props;
      this.input = input;
      this.control = this.input.closest('.js-form-control');
      this.errorMessage = this.control.querySelector('.js-form-control__error');
      this.isValid = false;
    }

    validate() {
      if (this.input.value.trim() == '') {
        this.showError('This input is required');
        this.isValid = false;
      } else {
        this.hideError();
        this.isValid = true;
      }
    }

    showError(message) {
      this.errorMessage.innerHTML = message;
      this.input.classList.add('is-invalid');
      this.errorMessage.classList.remove('u-hidden');
    }

    hideError() {
      this.input.classList.remove('is-invalid');
      this.errorMessage.classList.add('u-hidden');
    }
  }

  class LoadingButton {
    constructor(props) {
      const { button } = props;
      this.button = button;
      this.text = this.button.querySelector('.js-button__text');
      this.throbber = this.button.querySelector('.js-button__throbber');
    }

    startLoading() {
      this.text.classList.add('u-hidden');
      this.throbber.classList.remove('u-hidden');
    }

    stopLoading() {
      this.throbber.classList.add('u-hidden');
      this.text.classList.remove('u-hidden');
    }
  }

  // Cache DOM
  const form = document.forms['js-enquiries-form'];
  form.controls = [
    new FormControl({ input: form['js-enquiries-form__name'] }),
    new FormControl({ input: form['js-enquiries-form__telephone'] }),
    new FormControl({ input: form['js-enquiries-form__enquiry'] })
  ];
  form.submitBtn = new LoadingButton({ button: form['js-enquiries-form__submit-btn'] });
  const emailErrorMessage = document.querySelector('#js-enquiries-form__email-error-message');

  // Bind events
  form.addEventListener('submit', handleSumbit);

  // Behaviour
  function handleSumbit(event) {
    event.preventDefault();
    validateForm();
    if (formIsValid()) {
      form.submitBtn.startLoading();
      openEmailClientAndFormatEmail();
      setTimeout(() => {
        form.submitBtn.stopLoading();
        showNoEmailClientMessage();
      }, 3000);
    } else {
      scrollToFormTop();
    }
  }

  function openEmailClientAndFormatEmail() {
    // Get input values
    const customerName = form['js-enquiries-form__name'].value;
    const customerPhoneNumber = form['js-enquiries-form__telephone'].value;
    const customerQuery = form['js-enquiries-form__enquiry'].value;
    // Format mailto query
    const subject = encodeURIComponent(`Enquiry - ${customerName}`);
    const body = encodeURIComponent(`${customerQuery}\n\n${customerName} - ${customerPhoneNumber}`);
    // Open client's default email client and format email
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
  }

  function showNoEmailClientMessage() {
    emailErrorMessage.innerHTML = `Having troubles with the enquiries form?<br>Send us an email at ${emailAddress} with your enquiry details.`;
  }

  function validateForm() {
    form.controls.forEach(control => control.validate());
  }

  function formIsValid() {
    return form.controls.every(control => control.isValid);
  }

  function scrollToFormTop() {
    const offset = document.querySelector('#js-page-header').offsetHeight;
    const yDistance = form.getBoundingClientRect().top + window.pageYOffset;
    window.scroll({ top: yDistance - offset, behavior: 'smooth' });
  }
})();