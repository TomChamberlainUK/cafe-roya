const openTimesChecker = (function() {
  // Cache DOM
  const openingTimes = { container: document.querySelector('.js-opening-times') }
  openingTimes.heading = openingTimes.container.querySelector('.js-opening-times__heading');
  openingTimes.body = openingTimes.container.querySelector('.js-opening-times__body');

  console.log(openingTimes);

  // Get current time and date
  let date = new Date();
  let [day, hour, minute] = [date.getDay(), date.getHours(), date.getMinutes()];
  // [day, hour, minute] = [5, 19, 30]; // Set manually
  console.log(day, hour, minute);

  // Configure opening times and convert all times to minutes for comparisons
  convertToMinutes = (hours, minutes) => (hours * 60) + minutes;
  let currentTime = convertToMinutes(hour, minute);
  let lunchStart = convertToMinutes(12, 0);
  let lunchEnd = convertToMinutes(14, 30);
  let dinnerStart = convertToMinutes(17, 30);
  let dinnerEnd = convertToMinutes(21, 30);

  // Logic
  isSunday = (() => day === 0)();
  isAfter = time => currentTime >= time;
  isBefore = time => currentTime < time;
  isDuring = (startTime, endTime) => isAfter(startTime) && isBefore(endTime);

  // Messages to display
  const message = {
    heading: {
      open: 'We are Open!',
      closed: 'We are Closed.'
    },
    body: {
      misc: {
        open: '<a href="tel:01159221902" class="o-textbox__body--link">Call now</a> to check availability.',
        later: 'Come back later!',
        tomorrow: 'Come back tomorrow!'
      },
      lunch: {
        serving: 'Currently serving lunch until 14:30.',
        default: 'Lunch is available 12:00 - 14:30.',
      },
      dinner: {
        serving: 'Currently serving dinner until 21:30.',
        default: 'Dinner is available 17:30 - 21:30.'
      }
    },
    render: (heading, ...bodyLines) => {
      let body = '';
      bodyLines.forEach(line => body += `${line}<br>`);
      body += 'Check <a href="contact.html" class="o-textbox__body--link">Contact</a> for full details.';
      openingTimes.heading.innerHTML = heading
      openingTimes.body.innerHTML = body
    }
  }

  // Run
  function checkOpen() {
    if (isSunday) {
      console.log('Restaurant closed: it is sunday');
      message.render(message.heading.closed, message.body.misc.tomorrow, message.body.lunch.default, message.body.dinner.default);
    } else if (isBefore(lunchStart)) {
      console.log('Restaurant closed: it is before lunch');
      message.render(message.heading.closed, message.body.misc.later, message.body.lunch.default, message.body.dinner.default);
    } else if (isDuring(lunchStart, lunchEnd)) {
      console.log('Restaurant open: currently serving lunch');
      message.render(message.heading.open, message.body.misc.open, message.body.lunch.serving, message.body.dinner.default);
    } else if (isDuring(lunchEnd, dinnerStart)) {
      console.log('Restaurant closed: it is between lunch and dinner');
      message.render(message.heading.closed, message.body.misc.later, message.body.lunch.default, message.body.dinner.default);
    } else if (isDuring(dinnerStart, dinnerEnd)) {
      console.log('Restaurant open: currently serving dinner');
      message.render(message.heading.open, message.body.misc.open, message.body.lunch.default, message.body.dinner.serving);
    } else if (isAfter(dinnerEnd)) {
      console.log('Restaurant closed: it is after dinner');
      message.render(message.heading.closed, message.body.misc.tomorrow, message.body.lunch.default, message.body.dinner.default);
    } else {
      console.log('error: time not caught');
    }
  };
  checkOpen();
})();