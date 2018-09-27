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
  this.bookshelf = submit.bookshelf.toLowerCase();
}

const saveBook = bookObj => {
  const SQL = `INSERT INTO ${
    bookObj.bookshelf
  } (title, author, description, image_url, isbn) VALUES ($1, $2, $3, $4 ,$5);`;
  const values = [
    bookObj.title,
    bookObj.author,
    bookObj.description,
    bookObj.image_url,
    bookObj.isbn
  ];
  client.query(SQL, values).catch(console.error);
};

const saveShelf = bookshelf => {
  const SQL = `INSERT INTO Overall (shelf) VALUES ($1)`;
  const values = [bookshelf];
  client.query(SQL, values).catch(console.error);
};

const createTable = bookObj => {
  const create = `CREATE TABLE IF NOT EXISTS ${bookObj.bookshelf} (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description VARCHAR(8000),
  image_url VARCHAR(8000),
  isbn VARCHAR(8000));`;
  client.query(create).catch(console.error);
};

const undefinedChecker = bookSummary => {
  if (bookSummary.title === undefined) {
    bookSummary.title = 'Not available';
  }
  if (bookSummary.author === undefined) {
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
app.get('/', bookShelfRender);
app.get('/', createSearch);

app.get('/searches', searchRender);
app.get('/searchBar', searchBarRender);

//creates a new search to the Google Books API
app.post('/searches', createSearch);

//create listener on button for adding books
app.post('/save', saveToBookShelf);

//Catch-all
app.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

//functionality on the pages

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

function storageToDB(request, result) {
  for (let i = 0; i < result.rows.length; i++) {
    if (request.bookshelf === result.rows[i].shelf) {
      console.log(request.bookshelf);
      console.log(result.rows[i].shelf);
      let bookToSave = new BooksInShelf(request);
      saveBook(bookToSave);
      return;
    }
  }
  let bookToSave = new BooksInShelf(request);
  createTable(bookToSave);
  saveShelf(bookToSave.bookshelf);
  saveBook(bookToSave);
  return;
}

function saveToBookShelf(request, response) {
  const SQL = `SELECT * FROM Overall`;
  client.query(SQL).then(result => {
    if (result.rowCount === 0) {
      saveShelf('shelf');

      client.query(SQL).then(res => {
        storageToDB(request.body, res);
      });
    } else {
      storageToDB(request.body, result);
    }
  });
}

function bookShelfRender(request, response) {
  const SQL = `SELECT * FROM Overall`;
  let arrayToBeSent = [];
  client.query(SQL).then(result => {
    if (result.rowCount) {
      result.rows.forEach(bookshelf => {
        let bookList = [];
        const innerSQL = `SELECT * FROM ${bookshelf.shelf}`;
        client
          .query(innerSQL)
          .then(res => {
            if (res.rows) {
              res.rows.forEach(obj => bookList.push(obj));
            }
          })
          .then(() => {
            arrayToBeSent.push({
              shelfName: bookshelf.shelf,
              listOfBooks: bookList
            });
            console.log(arrayToBeSent);
          });
      });
      // response.render('pages')
    } else {
      response.render('pages/search');
    }
  });
}

function searchBarRender(request, response) {
  response.render('pages/search');
}
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
