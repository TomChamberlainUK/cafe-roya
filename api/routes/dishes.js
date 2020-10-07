// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Dish = require('../models/dishes');

// Request handling endpoints
// GET requests
router.get('/', (req, res, next) => {

	// Pagination options
	const pageOptions = {
		page: parseInt(req.query.page, 10) || 0,
		limit: parseInt(req.query.limit, 10) || 10
	}

	let query = {};
	for (key in req.query) {
		const value = req.query[key];
		switch (key) {
			// Skip page and limit queries
			case 'page':
			case 'limit':
				break;
			case 'name':
			case 'description':
				query[key] = { $regex: new RegExp(value), $options: 'i' }
				break;
			case 'course':
				query[key] = value;
				break;
			case 'dietaryOptions':
				query[key] = { $all: value }
				break;
			default:
				console.log(`Dishes GET request error. Search parameter "${key}" not recognised.`);
		}
	}

	Dish.find(query)
	.select('-__v')
	.limit(pageOptions.limit)
	.skip(pageOptions.page * pageOptions.limit)
	.sort( [['date', -1 ], ['_id', -1]] ) // Sort first by date, and then by ID (which will sort by creation date)
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			dishes: docs.map(doc => {
				return {
					id: doc.id,
					name: doc.name,
					description: doc.description,
					course: doc.course,
					dietaryOptions: doc.dietaryOptions,
					menus: doc.menus,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/api/dishes/' + doc._id
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

// POST requests
router.post('/', (req, res, next) => {
	const newDish = new Dish({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		description: req.body.description,
		course: req.body.course,
		dietaryOptions: req.body.dietaryOptions
	});
	newDish.save()
	.then(result => {
		res.status(201).json({
			message: 'New dish successfully uploaded to the database.',
			dish: {
				id: result.id,
				name: result.name,
				description: result.description,
				course: result.course,
				dietaryOptions: result.dietaryOptions
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
	const { id } = req.params;
	Dish.findById(id)
	.select('-__v')
	.exec()
	.then(doc => {
		if (doc) {
			res.status(200).json({
				id: doc.id,
				name: doc.name,
				description: doc.description,
				course: doc.course,
				dietaryOptions: doc.dietaryOptions
			});
		} else {
			res.status(404).json({
				message: `No valid dish available with ID: ${id}`
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


// PATCH requests
router.patch('/:id', (req, res, next) => {
	const { id } = req.params;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Dish.update({ _id: id }, { $set: updateOps })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Dish successfully patched on the server.',
			id
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});
// The above requests should be formatted like the following example:
// 	[
// 		{ "propName": "name", "value": "Lasagne" },
//		{ "propName": "description", "value": "Tasty little dish" } 
// 	]


// DELETE requests
router.delete('/:id', (req, res, next) => {
	const { id } = req.params;
	Dish.deleteOne({ _id: id })
	.then(result => {
		res.status(200).json({
			message: 'Dish successfully deleted from the database.',
			id
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