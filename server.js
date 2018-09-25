'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MIddleware

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// constructor for book search result
function Book(bookResults) {
  this.title = bookResults.volumeInfo.title;
  this.author = bookResults.volumeInfo.authors;
  this.description = bookResults.volumeInfo.description;
  this.image_url = bookResults.volumeInfo.imageLinks.thumbnail;
}
const undefinedChecker = bookSummary => {
  if (bookSummary.title === undefined) {
    bookSummary.title = 'Not available';
  }
  if (bookSummary.author === undefined) {
    console.log(bookSummary.description);
    bookSummary.author = 'Not available';
  }
  if (bookSummary.description === undefined) {
    bookSummary.description = 'Not available';
  }
  if (bookSummary.image_url === undefined) {
    bookSummary.image_url = 'Not available';
  }
  bookSummary.author = bookSummary.author.join(', ');
};

//Temporary Search Result Array

//handle error
const handleError = (err, res) => {
  console.error(err);
  if (res) res.status(500).send('Sorry, somethine went wrong');
};

// server-side templating
app.set('view engine', 'ejs');

//API Routes
app.get('/', mainRender);
app.get('/', createSearch);
app.get('/searches', searchRender);

//creates a new search to the Google Books API
app.post('/searches', createSearch);

//Catch-all
app.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

function mainRender(request, response) {
  response.render('pages/index');
}

function searchRender(request, response) {
  response.render('pages/searches/show');
}

function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent
    .get(url)
    .then(apiResponse => {
      const bookResult = apiResponse.body.items.map(element => {
        let summary = new Book(element);
        undefinedChecker(summary);
        return summary;
      });
      console.log(bookResult);
      return bookResult;
    })
    .then(searchResult =>
      response.render('pages/searches/show', { resultArray: searchResult })
    )
    .catch(error => handleError(error, response));
}

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
