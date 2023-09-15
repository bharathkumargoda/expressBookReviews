const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let differentusers = users.filter((user) => user.username === username);

  if(differentusers.length>0)
  return true;
  else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let correctUsers= users.filter((user) => 
{ return (user.username === username && user.password === password)
});
if(correctUsers.length>0)
return true;
else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  let username = req.body.username;
  let password = req.body.password;
  
  if(!username || !password)
  {
      return res.status(404).json({message: "Error Logging in"});
  }
  if(authenticatedUser(username,password))
  {
      let accessToken= jwt.sign({data: password},'access',{expiresIn: 60 * 60})
      req.session.authorization = { accessToken,username};
      return res.status(200).json({message : "User Successfully logged In"}); 
  }
  else return res.status(208).json({message: "Invalid login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const pbooks = new Promise ( (resolve, reject)=>{
    let isbn = req.params.isbn;
    let review = req.body.review;
    let username = req.session.authorization['username'];
    if(review)
    for(  key in books)
    {
        if(key === isbn )
        {
            books[key].reviews[username]=review;
            resolve(res.send("Review Added Successfully"));
        }
    }
    reject(res.send("Cannot find Books with Specified isbn"));
  })
  pbooks
       .then(()=>(console.log("Promise Resolved")))
       .catch((err)=>(console.log(err)))
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const pbooks = new Promise ( (resolve, reject)=>{
        let isbn = req.params.isbn;
        let username = req.session.authorization['username'];
        for(  key in books)
        {
            if(key === isbn )
            {
                delete books[key].reviews[username];
                resolve(res.send("Review Deleted Successfully"));
            }
        }
        reject(res.send("Cannot find Books with Specified isbn"));
      })
      pbooks
           .then(()=>(console.log("Promise Resolved")))
           .catch((err)=>(console.log(err)))
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;