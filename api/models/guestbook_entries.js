const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let guestbookEntrySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  comment: { type: String, required: true }
}, { collection: 'guestbookentries' });

module.exports = mongoose.model('GuestbookEntry', guestbookEntrySchema);