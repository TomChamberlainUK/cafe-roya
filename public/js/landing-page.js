// Set landing page to full screen height
(function() {
  // Cache DOM
  const landingPage = document.querySelector('#js-landing-page');

  // Configure
  const pageHeaderHeight = 52;
  let windowHeight = window.innerHeight;

  // Bind events
  init();

  // Behaviour
  function init() {
    setHeight(windowHeight - pageHeaderHeight);
  }

  function setHeight(value) {
    landingPage.style.height = `${value}px`;
  }
})();


// // Set landing page message
// (function() {
//   // Cache DOM
//   const heading = document.querySelector('#js-landing-page__heading');
//   const body = document.querySelector('#js-landing-page__body');

//   // Helpers
//   // const parseTime = time => 
//   const toMinutes = (hours, minutes) => (hours * 60) + minutes;

//   // Configure
//   const date = new Date();
//   const [day, hour, minute] = [date.getDay(), date.getHours(), date.getMinutes()];
//   const currentTime = toMinutes(hour, minute);
//   const lunchStart = toMinutes(12, 0);
//   const lunchEnd = toMinutes(14, 30);
//   const dinnerStart = toMinutes(17, 30);
//   const dinnerEnd = toMinutes(21, 30);
//   // let lunchStart, lunchEnd, dinnerStart, dinnerEnd;

//   // Bind events
//   init();

//   // Behaviour
//   function init() {
//     fetch('http://192.168.0.69:3000/api/config')
//     .then(response => response.json())
//     .then(response => {
//       const { openingDays, lunchHours, dinnerHours, closingDates } = response;
//       // if () // closing dates closed

//     })
//     .catch(error => console.error(error));

//     // Logic
//     const todayIsSunday = day === 0;
//     const currentTimeIsBefore = time => currentTime < time;
//     const currentTimeIsAfter = time => currentTime >= time;
//     const currentTimeIsBetween = (startTime, endTime) => currentTimeIsAfter(startTime) && currentTimeIsBefore(endTime);
    
//     //  Sunday
//     if (todayIsSunday) {
//       setMessage(
//         'We are Currently Closed',
//         `
//           Come back tomorrow!<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     // Monday - Saturday
//     // Before lunch
//     else if (currentTimeIsBefore(lunchStart)) {
//       setMessage(
//         'We are Currently Closed',
//         `
//           Come back later!<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     // During lunch
//     else if (currentTimeIsBetween(lunchStart, lunchEnd)) {
//       setMessage(
//         'We are Open!',
//         `
//           <a class="o-body--alt-link" href="#">Call us</a> to check availability<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     // Before dinner
//     else if (currentTimeIsBefore(dinnerStart)) {
//       setMessage(
//         'We are Currently Closed',
//         `
//           Come back later!<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     // During dinner
//     else if (currentTimeIsBetween(dinnerStart, dinnerEnd)) {
//       setMessage(
//         'We are Open!',
//         `
//           <a class="o-body--alt-link" href="#">Call us</a> to check availability<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     // After Dinner
//     else if (currentTimeIsAfter(dinnerEnd)) {
//       setMessage(
//         'We are Currently Closed',
//         `
//           Come back tomorrow!<br>
//           Lunch is available <span class="o-body--bold">12:00 - 14:30</span><br>
//           Dinner is available <span class="o-body--bold">17:30 - 21:30</span><br>
//           Check <a href="events.html" class="o-body--alt-link">Events</a> for more
//         `
//       );
//     }
//     else {
//       console.log('uh oh');
//     }
//   }

//   function setMessage(headingText, bodyText) {
//     heading.innerHTML = headingText;
//     body.innerHTML = bodyText;
//   }
// })();



// Set landing page message
(function() {
  // Cache DOM
  const dom = {
    heading: document.querySelector('#js-landing-page__heading'),
    body: document.querySelector('#js-landing-page__body')
  }
  const heading = document.querySelector('#js-landing-page__heading');
  const body = document.querySelector('#js-landing-page__body');

  // Bind events
  init();

  // Behaviour
  function init() {
    fetch('http://192.168.0.69:3000/api/config')
    .then(response => response.json())
    .then(response => {
      const { lunchHours, dinnerHours } = response;

      let nextOpen = '';

      const isOpen = (function() {
        const { openingDays, closingDates } = response;

        const now = moment();
        const closingDatesStart = moment(closingDates.start).startOf('day');
        const closingDatesEnd = moment(closingDates.end).endOf('day');
        const lunchHoursStart = moment(lunchHours.start, 'HH:mm');
        const lunchHoursEnd = moment(lunchHours.end, 'HH:mm');
        const dinnerHoursStart = moment(dinnerHours.start, 'HH:mm');
        const dinnerHoursEnd = moment(dinnerHours.end, 'HH:mm');

        const isDuringClosingDates = date => date >= closingDatesStart && date < closingDatesEnd;
        const isBeforeLunch = date => date < lunchHoursStart;
        const isDuringLunch = date => date >= lunchHoursStart && date < lunchHoursEnd;
        const isBeforeDinner = date => date < dinnerHoursStart;
        const isDuringDinner = date => date >= dinnerHoursStart && date < dinnerHoursEnd;
        const isDuringOpeningDays = date => {
          const openingDaysStart = date.clone()
                                       .day(openingDays.start)
                                       .startOf('day');
          const openingDaysEnd = date.clone()
                                     .day(openingDays.end.toLowerCase() === "sunday"
                                       ? 7 // in moment days of week start with sunday at 0, 7 forces next sunday
                                       : openingDays.end)
                                     .endOf('day');
          return date >= openingDaysStart && date <= openingDaysEnd;
        }
        

        function findNextOpeningDay() {
          const nextDate = now.clone();
          const tomorrow = now.clone()
                              .add(1, 'day')
                              .endOf('day');
          const oneWeekFromNow = now.clone()
                                    .add(1, 'week')
                                    .endOf('day');

          do {
            nextDate.add(1, 'day');
          } while (isDuringClosingDates(nextDate) || !isDuringOpeningDays(nextDate));

          if (nextDate < tomorrow) {
            return 'tomorrow';
          } else if (nextDate < oneWeekFromNow) {
            return `on ${nextDate.format('dddd')}`;
          } else {
            return `on ${nextDate.format('dddd, Do MMMM')}`;
          }
        }

        // Current date is during closing dates perios
        if (isDuringClosingDates(now)) {
          nextOpen = findNextOpeningDay();
          return false;
        }
        // Current day is outside of opening days
        else if (!isDuringOpeningDays(now)) {
          nextOpen = findNextOpeningDay();
          return false;
        }
        // For days where the cafe is open:
        else if (isBeforeLunch(now)) {
          nextOpen = 'later';
          return false;
        } else if (isDuringLunch(now)) {
          return true;
        } else if (isBeforeDinner(now)) {
          nextOpen = 'later';
          return false;
        } else if (isDuringDinner(now)) {
          return true;
        }
        // After the cafe has closed for the day
        else {
          nextOpen = findNextOpeningDay();
          return false;
        }
      })();

      const heading = isOpen ? 'We are Open!' : 'We are Currently Closed';
      const firstLine = isOpen
        ? '<a class="o-body--alt-link" href="#">Call us</a> to check availability'
        : `Come back ${nextOpen}!`;
      const body = `
        ${firstLine}<br>
        Lunch is available <span class="o-body--bold">${lunchHours.start} - ${lunchHours.end}</span><br>
        Dinner is available <span class="o-body--bold">${dinnerHours.start} - ${dinnerHours.end}</span><br>
        Check <a href="contact.html" class="o-body--alt-link">Contact</a> for more details.
      `;

      // Render
      dom.heading.innerHTML = heading;
      dom.body.innerHTML = body;

    }).catch(error => console.error(error));
  }
})();