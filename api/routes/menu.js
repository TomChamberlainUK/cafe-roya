// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Menu = require('../models/menus');
const Dish = require('../models/dishes');

// Get env variables
const SITE_URL = process.env.SITE_URL || 'http://0.0.0.0';
const PORT = process.env.PORT || 3000;

// Request handling endpoints
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

// BATCH REQUEST THAT ADDS, EDITS AND DELETES DISHES AS WELL
router.post('/', (req, res, next) => {
	// Prepare db requests
	const menuId = (() => req.body.menuId ? req.body.menuId : mongoose.Types.ObjectId())();
	const dishIds = [];
	const operations = [];
	req.body.dishes.forEach(dish => {
		if (!dish.dishId) dish.dishId = mongoose.Types.ObjectId();
		dishIds.push(dish.dishId);
		operations.push({
			updateOne: {
				filter: { _id: mongoose.Types.ObjectId(dish.dishId) },
				update: {
					$set: dish
				},
				upsert: true
			}
		});
	});
	req.body.partialDeletedIds.forEach(id => {
		operations.push({
			updateOne: {
				filter: { _id: mongoose.Types.ObjectId(id) },
				update: {
					$pull: { menus: menuId }
				}
			}
		});
	});
	req.body.completeDeletedIds.forEach(id => {
		operations.push({
			deleteOne: {
				filter: { _id: mongoose.Types.ObjectId(id) }
			}
		});
	})
	Dish.bulkWrite(operations)
	.then(dishWriteResult => {
		Menu.findOneAndUpdate({ _id: menuId }, { _id: menuId, monthActive: req.body.month, dishes: dishIds }, { upsert: true, useFindAndModify: false })
		.then(menuWriteResult => {
			res.status(200).json({dishWriteResult, menuWriteResult});
		})
		.catch(menuWriteError => {
			console.log(menuWriteError);
			res.status(500).json({
				error: menuWriteError
			});
		});
	})
	.catch(dishWriteError => {
		console.log(dishWriteError);
		res.status(500).json({
			error: dishWriteError
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
		// if (doc) {
		// 	res.status(200).json(doc);
		// } else {
		// 	res.status(404).json({
		// 		message: 'No valid menu found for current month',
		// 		id: id
		// 	});
		// }
		if (!doc) res.status(404).json({ exists: false });
		const response = {
			exists: true,
			id: doc._id,
			month: doc.monthActive,
			starters: [],
			mains: [],
			desserts: [],
			request: {
				type: 'GET',
				url: `${SITE_URL}:${PORT}/api/menu/${doc._id}`
			}
		}
		doc.dishes.forEach(dish => {
			dish = {
				id: dish._id,
				menus: dish.menus,
				course: dish.course,
				name: dish.name,
				description: dish.description,
				dietaryOptions: dish.dietaryOptions,
				request: {
					type: 'GET',
					url: `${SITE_URL}:${PORT}/api/dishes/${dish._id}`
				}
			}
			switch (dish.course) {
				case 'starter':
					response.starters.push(dish);
					break;
				case 'main':
					response.mains.push(dish);
					break;
				case 'dessert':
					response.desserts.push(dish);
					break;
			}
		});
		res.status(200).json(response);
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
	Menu.findOne({
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
		if (!doc) {
			res.status(200).json({ exists: false, id: mongoose.Types.ObjectId() });
		} else {
			const response = {
				exists: true,
				id: doc._id,
				month: doc.monthActive,
				starters: [],
				mains: [],
				desserts: [],
				request: {
					type: 'GET',
					url: `${SITE_URL}:${PORT}/api/menu/${doc._id}`
				}
			}
			doc.dishes.forEach(dish => {
				dish = {
					id: dish._id,
					menus: dish.menus,
					course: dish.course,
					name: dish.name,
					description: dish.description,
					dietaryOptions: dish.dietaryOptions,
					request: {
						type: 'GET',
						url: `${SITE_URL}:${PORT}/api/dishes/${dish._id}`
					}
				}
				switch (dish.course) {
					case 'starter':
						response.starters.push(dish);
						break;
					case 'main':
						response.mains.push(dish);
						break;
					case 'dessert':
						response.desserts.push(dish);
						break;
				}
			});
			res.status(200).json(response);
		}
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