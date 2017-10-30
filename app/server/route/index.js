const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
//const jwt    = require('jsonwebtoken');
const books = require('../models/book');
const user = require('../models/user');
const reviews = require('../models/review');
const favo = require ('../favorites');
const borrowed = require ('../borrow');


app.use(bodyParser.json());

const dataType = {bookName:'string', Author: 'string'};

module.exports = (app) => {
  app.get('/api', (req, res) => 
  	res.json('Welcome to Hello-Books.'));

//API Endpoint to add a book
  app.post('/api/v1/books', (req, res)=> {
  	const item = req.body;
    item.bookId = books.length + 1;
   
     if (!item.bookName) {

        return res.status(500).json({ status: false, message: "please enter the name of the book"});
    }
    else if (!item.Author) {
        return res.status(500).json({ status: false, message: "please enter the name of the Author"});
    }
    else if (!item.Author) {
        return res.status(500).json({ status: false, message: "please enter the name of the Author"});
    }
    else if (!item.bookStatus) {
        return res.status(500).json({ status: false, message: "please enter the status of the book"});
    }
    
    else if(!isNaN(item.bookName)){
        return res.status(500).json({ status: false, message: "Name of book cannot be a number"});
    }
    else if (!isNaN(item.Author)){
        return res.status(500).json({ status: false, message: "Name of Author cannot be a number"});
    }
    else if (!isNaN(item.bookStatus)){
        return res.status(500).json({ status: false, message: "status of book cannot be a number"});
    }
    else if (item.bookStatus === "available" || item.bookStatus === "unavailable") {
  	books.push(item)
            res.status(200).json({message:'book added successfully', "data": item});
        //console.log(typeof(item.bookName))
          }
          else{
          return res.status(500).json({ status: false, message: "books can either be available or unavailable"});
        }
        });
  

  // API Endpoint to modify a book
app.put('/api/v1/books/:bookId', (req, res) => {

	const bookId = parseInt(req.params.bookId, 10);
  const exist = books.filter(r => r.bookId === bookId)[0];
 
    if(!exist){

    res.status(404).json("book does not exist")
    }
      
       exist.bookName = req.body.bookName;
       exist.Author = req.body.Author;
       exist.bookStatus = req.body.bookStatus;

     if(!isNaN(exist.bookName)){
        return res.status(500).json({ status: false, message: "Name of book cannot be a number"});
    }
     if (!isNaN(exist.Author)){
        return res.status(500).json({ status: false, message: "Name of Author cannot be a number"});
    }
       if (exist.bookStatus === "available" || exist.bookStatus === "unavailable") {
      
      res.status(201).json({message:'book modified successfully', "data": exist});
    }
    else {
      return res.status(500).json({ status: false, message: "books can either be available or unavailable"});
    }
     });


// API Endpoint to get all the books in the catalog
app.get('/api/v1/books', (req, res)=> {
	res.json(books);
});


//API Endpoint to borrow a book
app.post('/api/v1/users/:userId/borrow/:bookId', (req, res)=> {

  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(r => r.userId === userId)[0];
 
  const bookId = parseInt(req.params.bookId, 10);
  const bookExist = books.filter(r => r.bookId === bookId)[0];
  
 
if (!bookExist) {
  res.status(404).json("This book does not exist")
}
else if (!userExist) {
  res.status(404).json("user not found")
}

if (bookExist && bookExist.bookStatus === "unavailable") {
  res.status(404).json({message: "This book is currently unavailable", "bookName": bookExist.bookName, 
    "bookId": bookId, "status": bookExist.bookStatus, "username": userExist.username, "userId": userId})
}
else {
  borrowed.push(userId, bookId)
  res.json({ status: true, message:'enjoy the book', "bookName": bookExist.bookName, "bookId": bookId, 
    "username": userExist.username, "userId": userId} )
}

  });

 
//API to return borrowed book
app.post('/api/v1/users/:userId/return/:bookId', (req, res)=> {
  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(users => users.userId === userId)[0];
 
  const bookId = parseInt(req.params.bookId, 10);
  const bookExist = books.filter(r => r.bookId === bookId)[0];
  
  res.json({ status: true, message:'Thanks for the return, we are sure you enjoy the book', 
    "bookName": bookExist.bookName, "bookId": bookId, 
    "username": userExist.username, "userId": userId} )


  });


//API Endpoint to accept/reject reqquest to borrow a book
app.put('/api/v1/users/:userId/borrow/:bookId', (req, res) => {

  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(r => r.userId === userId)[0];
  const bookId = parseInt(req.params.bookId, 10)
  const exist = books.filter(r => r.bookId === bookId)[0];


 
    if(exist.bookStatus !== "unavailable"){

      res.status(200).json({message:'Approved to borrow', "bookName": exist.bookName, "bookId": bookId, 
    "Admin": userExist.username});
    }
    else 
      {
      res.status(404).json({message:"book currently unavailable to borrow","bookName": bookExist.bookName, 
    "bookId": bookId, "status": bookExist.bookStatus, "Admin": userExist.username});
      
    }
  });

//API Endpoint to accept returned book

app.put('/api/v1/users/:userId/return/:bookId', (req, res) => {

  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(r => r.userId === userId)[0];
  const bookId = parseInt(req.params.bookId, 10)
  const exist = books.filter(r => r.bookId === bookId)[0];


      res.status(200).json({message:"This book is successfully returned", "bookName": exist.bookName, "bookId": bookId, 
    "Admin": userExist.username})
      
  });

//API Endpoint to review a book
app.post('/api/v1/users/:userId/review/:bookId', (req, res)=> {
  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(r => r.userId === userId)[0];
  const bookId = parseInt(req.params.bookId, 10)
  const bookExist = books.filter(r => r.bookId === bookId)[0];
   item.reviewId = reviews.length + 1;

  const item = req.body;
       if (!userExist) {
        res.status(404).json("user not found")
      }

      else if (!bookExist) {
        res.status(404).json("This book does not exist")
        }
 
     else if(!item.review) {
        return res.status(404).json({ status: false, message: "kindly tell us your experience about this book"});
    }
    
    bookExist.review = item
    reviews.push({userId, bookId, item})
            res.status(200).json({message:'Thanks for you review', "review": item, "userId": userId, "bookId": bookId});
        });

//API Endpoint to mark a book as favorite
app.post('/api/v1/users/:userId/fav/:bookId', (req, res)=> {
  const userId = parseInt(req.params.userId, 10);
  const userExist = user.filter(r => r.userId === userId)[0];
  const bookId = parseInt(req.params.bookId, 10)
  const bookExist = books.filter(r => r.bookId === bookId)[0];


  if (!bookExist) {
  res.status(404).json("This book does not exist")
}
else if (!userExist) {
  res.status(404).json("user not found")
}

else {
  favo.push({userId,bookId});
  res.json({ status: true, message: "Marked as favorite", "bookName": bookExist.bookName, "bookId": bookId, 
    "username": userExist.username, "userId": userId} )
}
});


//API Endpoint to get user's favorite books
app.get('/api/v1/users/:userId/favbooks', (req, res)=>{
  const userId = parseInt(req.params.userId, 10);
  const userExist = favo.filter(r => r.userId === userId)[0];
    if (!userExist) {
        res.status(404).json("you have no favorite book")
      }
    else {
      let fav = [];
      fav = userExist.favorites
      const favbooks = userExist.bookId
      const usersname = userExist.userId
      //const favoritebooks = userExist.favorites;
      // res.json({"username": userExist.username, "favorites": fav});
       res.json({message: "see below your favorites book", "favbook": favbooks, "user": usersname});
    }
});


//API Endpoint to get book with highest number of upvotes in descending order

 app.get('/api/v1/books/sorted', (req, res)=> {
   const sorted = [];
   var sortee
  
  sortee = books.sort((a,b) => b.upvotes - a.upvotes);
  sorted.push(sortee);
  res.json({"books": sorted})
 });


};







