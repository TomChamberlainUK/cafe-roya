// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const GuestbookEntry = require('../models/guestbook_entries');

// Get env variables
const SITE_URL = process.env.SITE_URL || 'http://0.0.0.0';
const PORT = process.env.PORT || 3000;


// Request handling
router.get('/', (req, res, next) => {

	// Pagination options
	let pageOptions = {
		page: parseInt(req.query.page, 10) || 0,
		limit: parseInt(req.query.limit, 10) || 10
	}

	// Format queries
	let query = {};
	if (Object.keys(req.query).length !== 0) { // Check if URL query exists
		Object.keys(req.query).forEach(key => { // Format each query param
			const value = req.query[key];
			switch (key) {
				// Skip page and limit queries
				case 'page':
				case 'limit':
					break;
				// Format case-insensitive regex query for name, location & comment
				case 'name':
				case 'location':
				case 'comment':
					query[key] = { $regex: new RegExp(value), $options: 'i' }
					break;
				// Format date to match entire day
				case 'date':
					query[key] = { $gte: moment(value).startOf('day'), $lte: moment(value).endOf('day') } // greater than or equal to start of day and less than or equal to end of day
					break;
				// Log any unmatched queries
				default:
					console.log(`Guestbook GET request error. Search parameter '${key}' not recognised.`);
			}
		});
	}

	GuestbookEntry.find(query)
	.select('-__v')
	.limit(pageOptions.limit)
	.skip(pageOptions.page * pageOptions.limit)
	.sort( [['date', -1 ], ['_id', -1]] ) // Sort first by date, and then by ID (which will sort by creation date)
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			guestbookEntries: docs.map(doc => {
				return {
					name: doc.name,
					location: doc.location,
					date: doc.date,
					comment: doc.comment,
					id: doc._id,
					request: {
						type: 'GET',
						url: `${SITE_URL}:${PORT}/api/guestbook/${doc._id}`
					}
				}
			})
		}
		res.status(200).json(response);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.post('/', (req, res, next) => {

	console.log(req);

	const guestbookEntry = new GuestbookEntry({
		_id: mongoose.Types.ObjectId(),
		date: req.body.date,
		name: req.body.name,
		location: req.body.location,
		comment: req.body.comment
	});
	guestbookEntry.save()
	.then(result => {
		console.log(result);
		res.status(201).json({
			message: 'Guestbook entry created:',
			createdEntry: {
				name: result.name,
				location: result.location,
				date: result.date,
				comment: result.comment,
				id: result._id,
				request: {
					type: 'GET',
					url: `${SITE_URL}:${PORT}/api/guestbook/${result._id}`
				}
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});



router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	GuestbookEntry.findById(id)
	.exec()
	.then(doc => {
		console.log('From database', doc);
		if (doc) {
			res.status(200).json({
				name: doc.name,
				location: doc.location,
				date: doc.date,
				comment: doc.comment,
				id: doc._id,
				request: {
					type: 'PATCH, DELETE',
					url: `${SITE_URL}:${PORT}/api/guestbook/${doc._id}`
				}
			});
		} else {
			res.status(404).json({
				message: 'No valid guestbook entry found matching given ID',
				id: id
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.patch('/:id', (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	GuestbookEntry.update({ _id: id }, { $set: updateOps })
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json({
			message: 'Guestbook entry updated',
			request: {
				type: 'GET',
				url: `${SITE_URL}:${PORT}/api/guestbook/${id}`
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:id', (req, res, next) => {
	const id = req.params.id;
	GuestbookEntry.deleteOne({ _id: id })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Guestbook entry deleted',
			request: {
				type: 'GET',
				url: `${SITE_URL}:${PORT}/api/guestbook/`
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


// Export
module.exports = router;