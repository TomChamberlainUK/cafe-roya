const guestbook = (function() {

  // Cache DOM
  const guestbook = { container: document.querySelector('.js-guestbook__content') }
    guestbook.template = {
      section: guestbook.container.querySelector('.js-guestbook-template__section'),
      entry: guestbook.container.querySelector('.js-guestbook-template__entry'),
      seperator: guestbook.container.querySelector('.js-guestbook-template__seperator')
    }

  class Section {
    constructor(date) {
      this.nodeTree = guestbook.template.section.content.cloneNode(true);
      this.nodes = {
        date: this.nodeTree.querySelector('.js-guestbook__date'),
        content: this.nodeTree.querySelector('.js-guestbook__section-content')
      } 
      this.data = {
        date: date
      }
      render(this.data.date, this.nodes.date);
    }
    addEntry(entry) {
      this.nodes.content.append(entry);
    }
  }

  class Entry {
    constructor(author, location, comment) {
      this.nodeTree = guestbook.template.entry.content.cloneNode(true);
      this.nodes = {
        author: this.nodeTree.querySelector('.js-guestbook__author'),
        location: this.nodeTree.querySelector('.js-guestbook__location'),
        comment: this.nodeTree.querySelector('.js-guestbook__comment')
      }
      this.data = {
        author: author,
        location: location,
        comment: comment
      }
      render(this.data.author, this.nodes.author);
      render(this.data.location, this.nodes.location);
      render(this.data.comment, this.nodes.comment);
    }
  }

  class Seperator {
    constructor() {
      this.nodeTree = guestbook.template.seperator.content.cloneNode(true);
    }
  }


  // Bind events
  events.on('loaded-guestbook', updateGuestbook);

  // Behaviour
  function updateGuestbook(guestbookData) {
    // Group data by date
    guestbookData = groupByDate(guestbookData.guestbookEntries);

    // Create DOM fragment
    let fragment = document.createDocumentFragment();

    // For each date:
    let counter = { count: 1, max: guestbookData.length };
    guestbookData.forEach(function(sectionData) {
      // Create section
      let section = new Section(moment(sectionData.date).format("dddd Do MMMM YYYY"));
      // Add each entry to section
      sectionData.entries.forEach(function(entryData) {
        let entry = new Entry(entryData.name, entryData.location, entryData.comment);
        section.addEntry(entry.nodeTree);
      });
      // Add section to fragment
      fragment.append(section.nodeTree);
      // Add seperator to fragment if not last count of for loop
      if (counter.count < counter.max) {
        let seperator = new Seperator;
        fragment.append(seperator.nodeTree);
        counter.count++;
      }
    });
    
    // Render fragment to page
    guestbook.container.append(fragment);
  }

  function groupByDate(guestbookData) {
    let entriesByDate = [];
    let buffer;
    let loggedDate;
    let counter = { count: 1, max: guestbookData.length };

    guestbookData.forEach(function(entryData) {
      // Check if processing a new date
      if (entryData.date !== loggedDate) {
        // If so log date, push buffer (if contains data) to date-grouped-array, clear and push new date and entry to buffer
        loggedDate = entryData.date;
        if (buffer) entriesByDate.push(buffer);
        buffer = {
          date: entryData.date,
          entries: [entryData]
        };
      } else {
        // else push entry to buffer
        buffer.entries.push(entryData);
      }
      // Push buffer to date-grouped-array if counter maxxed, else increment
      counter.count < counter.max ? counter.count++ : entriesByDate.push(buffer);
    });
    return entriesByDate;
  }
})();