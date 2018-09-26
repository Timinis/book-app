'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();

const app = express();
const PORT = process.env.PORT || 3000;

// MIddleware

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// constructor for book search result
let searchResultArray = [];

function Book(bookResults) {
  this.title = bookResults.volumeInfo.title;
  this.author = bookResults.volumeInfo.authors;
  this.description = bookResults.volumeInfo.description;
  this.image_url = bookResults.volumeInfo.imageLinks.thumbnail;
  this.isbn = bookResults.volumeInfo.industryIdentifiers[0].identifier;
}

function BooksInShelf(submit) {
  this.title = submit.title;
  this.author = submit.author;
  this.description = submit.description;
  this.image_url = submit.image_url;
  this.isbn = submit.isbn;
  this.bookshelf = submit.bookshelf;
}

const saveBook = bookObj => {
  const SQL = `INSERT INTO booklist (title, author, description, image_url, isbn, bookshelf) VALUES ($1, $2, $3, $4 ,$5, $6);`;
  const values = [
    bookObj.title,
    bookObj.author,
    bookObj.description,
    bookObj.image_url,
    bookObj.isbn,
    bookObj.bookshelf
  ];
  return client.query(SQL, values).catch(console.error);
};

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
  if (Array.isArray(bookSummary.image_url)) {
    bookSummary.author = bookSummary.author.join(', ');
  }
};

//Temporary Search Result Array

//handle error
const handleError = (err, res) => {
  console.error(err);
  res.render('pages/error', { errorRender: err });
};

// server-side templating
app.set('view engine', 'ejs');

//API Routes
app.get('/', mainRender);
app.get('/', createSearch);
app.get('/searches', searchRender);

//creates a new search to the Google Books API
app.post('/searches', createSearch);

//create listener on button for adding books
app.post('/save', saveToBookShelf);

//Catch-all
app.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

//functionality on the pages
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
  searchResultArray = [];
  superagent
    .get(url)
    .then(apiResponse => {
      searchResultArray = apiResponse.body.items.map(element => {
        let summary = new Book(element);
        undefinedChecker(summary);
        return summary;
      });
      return searchResultArray;
    })
    .then(searchResult =>
      response.render('pages/searches/show', { resultArray: searchResult })
    )
    .catch(error => handleError(error, response));
}

function saveToBookShelf(request, response) {
  let bookAdded = new BooksInShelf(request.body);
  saveBook(bookAdded);
}
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
