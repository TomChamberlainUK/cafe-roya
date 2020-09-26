const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let menuEntrySchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: { type: String, required: true },
	course: { type: String, required: true },
	dietary: {
	  	vegan: { type: Boolean, required: true },
		glutenFree: { type: Boolean, required: true },
		nutFree: { type: Boolean, required: true }
	},
	date: { type: Date, required: true }
}, { collection: 'menuentries' });

module.exports = mongoose.model('MenuEntry', menuEntrySchema);


// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// let menuSchema = new Schema({
// 	_id: mongoose.Schema.Types.ObjectId,
// 	name: { type: String, required: true },
// 	description: { type: String, required: true },
// 	course: { type: String, required: true },
// 	dietaryOptions: {
// 		vegan: { type: Boolean, required: true },
// 		glutenFree: { type: Boolean, required: true },
// 		nutFree: { type: Boolean, required: true }
// 	}
// })