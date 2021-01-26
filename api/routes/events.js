// Init
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', (req, res, next) => {
  // for fb graph API
  const facebook = {
    fields: ['name', 'description', 'start_time', 'end_time', 'cover'],
    since: process.env.NODE_ENV === 'production'
      ? moment().format('YYYY-MM-DD')
      : '2020-10-12',
    accessToken: process.env.FACEBOOK_EVENTS_ACCESS_TOKEN || '',
    getFields() { return this.fields.join(','); },
    getURL() { return `https://graph.facebook.com/100740744887263/events?fields=${this.getFields()}&since=${this.since}&asce=start_time&access_token=${this.accessToken}`; }
  }

  
  fetch(facebook.getURL())
  .then(response => response.json())
  .then(result => {
    // console.log(result);
    res.status(200)
       .json(result);
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