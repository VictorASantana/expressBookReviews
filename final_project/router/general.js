const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let usersNamed = users.filter((user) => {
        return user.username === username
    });

    if (usersNamed.length > 0) return true;
    return false;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."})
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    }

    return res.status(400).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return res.status(200).json(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const response = [];

    for (const [key, values] of Object.entries(books)) {
        const book = Object.entries(values);
        for (let i = 0; i < book.length; i++) {
            if (book[i][0] == 'author' && book[i][1] == req.params.author) response.push(books[key])
        }
    }

    if (response.length === 0) return res.status(404).json({ message: 'Author not found' });
    return res.status(200).json(response);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const response = [];

    for (const [key, values] of Object.entries(books)) {
        const book = Object.entries(values);
        for (let i = 0; i < book.length; i++) {
            if (book[i][0] == 'title' && book[i][1] == req.params.title) response.push(books[key])
        }
    }

    if (response.length === 0) return res.status(404).json({ message: 'Title not found' });
    return res.status(200).json(response);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return res.status(200).json(books[ISBN].reviews);
});

module.exports.general = public_users;
