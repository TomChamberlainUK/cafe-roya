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
    fetch('/api/config')
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