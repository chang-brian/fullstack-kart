const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const data = require('./client/src/items.json');

// API call to get suggestions
app.get('/suggestions', (req, res) => {
  res.json(data);
});

// API call to post item in kart
let jsonParser = bodyParser.json();
app.post('/kartItem', jsonParser, (req, res) => {
    let body = req.body;
    res.json(body);
});

// API call to get items in kart
app.get('/kart', (req, res) => {
    // let kart = localStorage.getItem('kart');
    // res.json(JSON.parse(kart));
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));