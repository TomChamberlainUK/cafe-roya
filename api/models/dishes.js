const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let dishSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: { type: String, required: true },
	course: { type: String, required: true },
	dietaryOptions: { type: Array },
	menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
}, { collection: 'dishes' });

module.exports = mongoose.model('Dish', dishSchema);