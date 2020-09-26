// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Menu = require('../models/menus');
const Dish = require('../models/dishes');


// Request handling endpoints
// GET requests
router.get('/', (req, res, next) => {
	Menu.find()
	.select('-__v')
	.populate('dishes', '-__v')
	.exec()
	.then(docs => {
		if (docs.length) {
			res.status(200).json(docs);
		} else {
			res.status(404).json({
				message: 'No valid menus found.'
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


router.get('/current', (req, res, next) => {
	const monthStart = moment().startOf('month').toDate();
	const monthEnd = moment().endOf('month').toDate();
	Menu.findOne({
		monthActive: {
			$gte: monthStart,
			$lte: monthEnd
		}
	})
	.select('-__v')
	.populate('dishes', '-__v')
	.exec()
	.then(doc => {
		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({
				message: 'No valid menu found for current month',
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


router.get('/date/:date', (req,res, next) => {
	const date = req.params.date;
	Menu.find({
		monthActive: {
			$gte: moment(date).startOf('month'),
			$lte: moment(date).endOf('month')
		}
	})
	.limit(1)
	.select('-__v')
	.populate('dishes', '-__v')
	.exec()
	.then(doc => {
		if (doc.length) {
			res.status(200).json({
				status: 200,
				doc: doc[0]
			});
		} else {
			res.status(404).json({
				status: 404,
				message: 'No valid menu found for date specified.'
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


// POST requests
router.post('/', (req, res, next) => {
	setTimeout(() => {
		res.status(201).json({
			message: 'New menu has been successfully uploaded to the server.'
		});
	}, 3000);
});


router.put('/', (req, res, next) => {

	const formattedDate = moment(req.body.month).format('MMMM YYYY');
	const menuId = (() => (req.body.id) ? req.body.id : mongoose.Types.ObjectId())(); // Get menu id if exists or create new id for new menu
	let operations = []; // Initialise bulk operations array
	let dishIds = []; // Initialise array of dish IDs for menu document refs

	console.log(req.body);

	// Create new upsert operation for each dish
	Object.keys(req.body.dishes).forEach(key => {

		const dish = req.body.dishes[key];

		if (!dish.id) dish.id = mongoose.Types.ObjectId(); // If no object ID exists, create one
		dishIds.push(dish.id); // add to dishIds array for menu document refs
		const filterQuery = { _id: mongoose.Types.ObjectId(dish.id) } // define filter query

		operations.push({
			updateOne: {
				filter: filterQuery,
				update: {
					$set: dish,
					$addToSet: { menus: menuId }
				},
				upsert: true
			}
		});

	});

	if (req.body.delete) {
		// Remove references to menus if partially deleted
		if (req.body.delete.partial) {
			Object.keys(req.body.delete.partial).forEach(key => {
				const dishId = req.body.delete.partial[key];
				const filterQuery = { _id: mongoose.Types.ObjectId(dishId) }

				operations.push({
					updateOne: {
						filter: filterQuery,
						update: {
							$pull: { menus: menuId }
						}
					}
				});
			});
		}

		// Remove documents if completely deleted
		if (req.body.delete.complete) {
			Object.keys(req.body.delete.complete).forEach(key => {
				const dishId = req.body.delete.complete[key];
				const filterQuery = { _id: mongoose.Types.ObjectId(dishId) }

				operations.push({
					deleteOne: {
						filter: filterQuery
					}
				});
			});
		}
	}


	Dish.bulkWrite(operations)
	.then(dishesResult => {

		// findOneAndUpdate params
		const filter = { _id: menuId }
		const update = {
			_id: menuId,
			monthActive: req.body.month,
			dishes: dishIds
		}
		const options = {
			upsert: true,
			useFindAndModify: false
		}

		Menu.findOneAndUpdate(filter, update, options)
		.then(menuResult => {

			const responseDetails = {
				totalDishes: dishesResult.nMatched,
				modifiedDishes: dishesResult.nModified,
				addedDishes: dishesResult.nUpserted
			}

			res.status(200).json({
				message: `The menu has been successfully uploaded to the server and will be live on the website during ${formattedDate}.`
			});
			
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
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