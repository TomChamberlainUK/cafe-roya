const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let configSchema = new Schema({
	openingDays: {
		start: { type: String, require: true },
		end: { type: String, require: true }
	},
	lunchHours: {
		start: { type: String, require: true },
		end: { type: String, require: true }
	},
	dinnerHours: {
		start: { type: String, require: true },
		end: { type: String, require: true }
	},
	setToClose: { type: Boolean, require: true },
	closingDates: {
		start: { type: Date, require: true },
		end: { type: Date, require: true },
		message: { type: String, require: true }
	}
}, {
	collection: 'config',
});

module.exports = mongoose.model('Config', configSchema);