'use strict';

const express = require('express');
const superagent = require('superagen');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


// MIddleware

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));


// server-side templating
app.set('view engine', 'ejs');

//API Routes
app.get('/', newSearch);

//Creates a new search to the Google Books API
app.post('/searches', createSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log('Listening on port: ${PORT}'));



