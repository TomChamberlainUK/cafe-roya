const eventsList = (function() {

	// Cache DOM
	const eventsList = document.querySelector('.js-events-list');
	const eventCardTemplate = eventsList.querySelector('.js-events-list__event-card-template');

	// Define classes
	class EventCard {
		constructor(fbData) {
			this.nodeTree = eventCardTemplate.content.cloneNode(true);
			this.nodes = {
				name: this.nodeTree.querySelector('.js-events-list__name'),
				description: this.nodeTree.querySelector('.js-events-list__description'),
				startTime: this.nodeTree.querySelector('.js-events-list__start-time'),
				endTime: this.nodeTree.querySelector('.js-events-list__end-time'),
				date: this.nodeTree.querySelector('.js-events-list__date'),
				image: this.nodeTree.querySelector('.js-events-list__image')
			}
			this.data = {
				name: fbData.name,
				description: fbData.description,
				startTime: moment(fbData.start_time).format("H:mm"),
				endTime: moment(fbData.end_time).format("H:mm"),
				date: moment(fbData.start_time).format("dddd Do MMMM"),
				url: `https://www.facebook.com/events/${fbData.id}/`,
				imageSrc: fbData.cover.source
			}
			render(this.data.name, this.nodes.name);
			render(this.data.description, this.nodes.description);
			render(this.data.startTime, this.nodes.startTime);
			render(this.data.endTime, this.nodes.endTime);
			render(this.data.date, this.nodes.date);
			this.nodes.name.href = this.data.url;
			this.nodes.image.src = this.data.imageSrc;
		}
	}


	// Bind events
	events.on('facebook-loaded', update);


	// Behaviour
	function update(eventsData) {
		let frag = new DocumentFragment();
		eventsData.data.forEach(data => {
			let eventCard = new EventCard(data);
			frag.appendChild(eventCard.nodeTree);
		});
		colc.prepend(frag);
	}
})();