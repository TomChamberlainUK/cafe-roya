# Cafe Roya

Website for Cafe Roya.

## Get Started

### Installation

> Ensure Node.js and npm are installed. Please note that a MongoDB database is required to display data.

Download or clone the repository, navigate to the root directory via the command line then enter:

```npm i```

npm will install all required dependencies

### Environment: ###

To serve, a .env file is required.
This must contain the following:
* **SITE_URL** _Set to site's URL._
* **PORT** _Set to port._
* **MONGODB_URL** _Set to MongoDB URL_
* **FACEBOOK_EVENTS_ACCESS_TOKEN** _Set to access token from Facebook._

### Commands

#### Serve

Navigate to the root directory then enter:

```npm run start```

The server will start listening on port **3000**.

#### Serve (With live update)

Navigate to the root directory then enter:

```npm run dev```

The server will start listening on port **3000** and will restart with any file changes.

## Credit

* [Express.js](https://expressjs.com/)