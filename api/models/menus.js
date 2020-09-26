const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let menuSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	monthActive: { type: Date, required: true },
	dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
}, { collection: 'menus' });

module.exports = mongoose.model('Menu', menuSchema);