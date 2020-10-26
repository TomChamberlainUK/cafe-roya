// Init
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const GalleryImage = require('../models/gallery_images');

// Init storage engine
const storage = multer.diskStorage({
	destination: './public/images/uploads/',
	filename: (req, file, callback) => {
		callback(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});

const upload = multer({
	storage,
	limits: {
		fileSize: 20000000
	},
	fileFilter: function(req, file, callback) {
		checkFileType(file, callback);
	}
}).array('galleryImage');

function checkFileType(file, callback) {
	// Allowed extensions
	const filetypes = /jpeg|jpg|png|gif/;
	// Check extensions
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return callback(null, true);
	} else {
		callback('Only images with filetypes jpeg, jpg, png, or gif are allowed to be uploaded.')
	}
}


router.get('/', (req, res, next) => {

	// Pagination options
	let pageOptions = {
		page: parseInt(req.query.page, 10) || 0,
		limit: parseInt(req.query.limit, 10) || 10
	}
	
	GalleryImage.find()
	.limit(pageOptions.limit)
	.skip(pageOptions.page * pageOptions.limit)
	.sort( [['date', -1 ], ['_id', -1]] ) // Sort first by date, and then by ID (which will sort by creation date)
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			images: docs.map(doc => {
				return {
					id: doc._id,
					originalName: doc.originalname,
					fileName: doc.filename,
					path: doc.path.replace(/^(public\/)/,''), // Remove public folder as not needed
					request: {
						type: 'GET',
						url: 'http://localhost:3000/api/gallery/' + doc._id
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
	upload(req, res, (err => {
		if (err) {
			console.log(err);
			res.status(400).json({
				error: err
			});
		} else {
			console.log(req.files);

			const operations = [];
			req.files.forEach(file => {
				operations.push({
					insertOne: {
						document: file
					}
				});
			});

			GalleryImage.bulkWrite(operations)
			.then(result => {
				res.status(201).json({
					result
				});
			})
			.catch(error => {
				console.log(error);
				res.status(500).json({
					error
				});
			});
		}
	}));
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	GalleryImage.findById(id)
	.exec()
	.then(doc => {
		if (doc) {
			const response = {
				id: doc._id,
				originalName: doc.originalname,
				fileName: doc.filename,
				path: doc.path.replace(/^(public\/)/,''), // Remove public folder as not needed
				request: {
					type: 'GET',
					url: 'http://localhost:3000/api/gallery/' + doc._id
				}
			}
			res.status(200).json(response);
		} else {
			res.status(404).json({
				message: 'No valid gallery image found matching given ID',
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

router.delete('/:id', (req, res, next) => {
	const id = req.params.id;
	GalleryImage.findByIdAndDelete(id)
	.exec()
	.then(doc => {
		fs.unlink(doc.path, (err) => {
			if (err) {
				res.status(500).json({
					error: err
				});
			}
			res.status(200).json({
				message: 'Gallery image deleted',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/api/gallery/'
				}
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