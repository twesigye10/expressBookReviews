const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// create a variable of server URL
const serverUrl = "http://localhost:5000";

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Task 10: Using axios asynchronous way to get all books
public_users.get("/books", async (req, res) => {
  try {
    const response = await axios.get(`${serverUrl}/`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Using axios asynchronous way to get book details based on ISBN
public_users.get("/book/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${serverUrl}/isbn/${isbn}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let results = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      results.push({ isbn: isbn, ...books[isbn] });
    }
  }
  if (results.length > 0) {
    return res.send(JSON.stringify(results, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Task 12: Using axios asynchronous way to get book details based on author
public_users.get("/book/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${serverUrl}/author/${author}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching author details" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  let results = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      results.push({ isbn: isbn, ...books[isbn] });
    }
  }
  if (results.length > 0) {
    return res.send(JSON.stringify(results, null, 4));
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Task 13: Using axios asynchronous way to get all books based on title
public_users.get("/book/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${serverUrl}/title/${title}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching title details" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
