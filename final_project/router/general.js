const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
      if(isValid(username)){
          res.status(404).json({message : "User already Exists"});
      }
      else{
          users.push({"username":username,"password": password});
          res.status(200).json(({message : "User Registered Successfully. Now you can Login"}))
      }
  }
  else
  return res.status(404).json({message : "Unable to Register User"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const allbooks = new Promise ( (resolve,reject)=>{
  if(Object.keys(books).length === 0)
  reject(res.send("Cannot get books")) 
  else
  resolve(res.send(JSON.stringify(books,null,4))) 
})
     allbooks
     .then( ()=>console.log("Promise Resolved"))
     .catch((err)=>console.log(err))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here'
const particularbook = new Promise ((resolve,reject) => {
    let isbn = req.params.isbn.toString();
    for(key in books){
        if(key === isbn){
          resolve(res.send(JSON.stringify(books[key],null,4))) ;
        }
    }
    reject(res.send("Cannot find Specified book with isbn"));
})
 particularbook
 .then(()=>console.log("Promise Resolved"))
 .catch((err)=>console.log(err)); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const pbooks = new Promise ( (resolve, reject)=>{
    let author = req.params.author.toString();
    let particularbooks =[];
    for(  key in books)
    {
        if(books[key].author === author )
        {
            particularbooks.push({"ISBN":key,"Author":author,"Tile":books[key].title,"Reviews":books[key].reviews})
        }
    }
    if(particularbooks.length>0)
    resolve(res.send(JSON.stringify(particularbooks,null,4)));
    else
    reject(res.send("Cannot find Books with Specified Author"));
  })
  pbooks
       .then(()=>(console.log("Promise Resolved")))
       .catch((err)=>(console.log(err)))
  

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const pbooks = new Promise ( (resolve, reject)=>{
    let title = req.params.title;
    let particularbooks =[];
    for(  key in books)
    {
        if(books[key].title === title )
        {
            particularbooks.push({"ISBN":key,"Author":books[key].author,"Tile":books[key].title,"Reviews":books[key].reviews})
        }
    }
    if(particularbooks.length>0)
    resolve(res.send(JSON.stringify(particularbooks,null,4)));
    else
    reject(res.send("Cannot find Books with Specified Title"));
  })
  pbooks
       .then(()=>(console.log("Promise Resolved")))
       .catch((err)=>(console.log(err)))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const pbooks = new Promise ( (resolve, reject)=>{
    let isbn = req.params.isbn;
    let particularbooks =[];
    for(  key in books)
    {
        if(key === isbn )
        {
            particularbooks.push({"ISBN":key,"Author":books[key].author,"Tile":books[key].title,"Reviews":books[key].reviews})
        }
    }
    if(particularbooks.length>0)
    resolve(res.send(JSON.stringify(particularbooks,null,4)));
    else
    reject(res.send("Cannot find Books with Specified isbn"));
  })
  pbooks
       .then(()=>(console.log("Promise Resolved")))
       .catch((err)=>(console.log(err)))
});

module.exports.general = public_users;