// Init
const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

const config = {
	HOST: process.env.HOST || 'localhost',
	PORT: process.env.PORT || 3000
}

// Configure API routes
const menuRoutes = require('./api/routes/menu');
const dishesRoutes = require('./api/routes/dishes');
const eventsRoutes = require('./api/routes/events');
const guestbookRoutes = require('./api/routes/guestbook');
const galleryRoutes = require('./api/routes/gallery');
const configRoutes = require('./api/routes/config');


// Init database
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to database.');
});


// Middleware
// Logging via morgan
app.use(morgan('dev'));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public'), {extensions:['html']}));

// CORS error prevention
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

// Routes to handle API requests
app.use('/api/menu', menuRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/config', configRoutes);

// 404 error handling
app.use((req, res, next) => {
	const error = new Error('Not found.');
	error.status = 404;
	next(error);
});

// Error handling
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		message: error.message
	})
});


// Start server
app.listen(config.PORT, () => console.log(`Server listening on http://${config.HOST}:${config.PORT}`));