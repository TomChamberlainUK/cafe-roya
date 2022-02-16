// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Config = require('../models/config');

// Get env variables
const SITE_URL = process.env.SITE_URL || 'http://0.0.0.0';
const PORT = process.env.PORT || 3000;

// Generic
router.get('/', (req, res, next) => {
	Config.findOne()
	.exec()
	.then(doc => {
		res.status(200).json(doc);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


// Opening Times
router.patch('/', (req, res, next) => {
	const updateOps = {};
	for (let ops of req.body) updateOps[ops.propName] = ops.value;
	console.log(updateOps);
	Config.updateOne({}, { $set: updateOps })
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json({
			message: 'Opening Times successfully updated.',
			updated: { ...updateOps },
			request: {
				type: 'GET',
				url: `${SITE_URL}:${PORT}/api/config`
			}
		})
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