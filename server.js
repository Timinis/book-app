'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MIddleware

app.use(express.static('./views'));
app.use(express.urlencoded({ extended: true }));

// server-side templating
app.set('view engine', 'ejs');

//API Routes
app.get('/', newSearch);
app.get('/')

//creates a new search to the Google Books API
app.post('/searches', createSearch);

//Catch-all
app.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

function newSearch(request, response) {
  response.render('pages/index');
  response.render('pages/searches/show');
}

function createSearch(request, response){
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    console.log(request.body);
    if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
    if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

    superagent.get(url)
        .then(apiResponse => console.log(apiResponse));
    
}
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
