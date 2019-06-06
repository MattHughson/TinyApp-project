var express = require("express");
var cookieParser = require('cookie-parser'); //cookie parser request
var app = express();
app.use(cookieParser());
var PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //Installing and Setting Up EJS

//dataBase for the short URLS
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// user database
// maybe change the key to accesss the id
const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  }

// random code for URL shorter
function generateRandomString() {
    var shortLength = 6;
    var randomNumb = Math.floor(Math.random() * 10);
    var result = "";
    var letterArray = [ 'a', 'g', 'y', 't', 'x', 'j', 'e', 'h', 'u', 'p' ]
    for(var i = 0; i < shortLength; i++){
        if(randomNumb % 2 == 0){
         randomNumb =  Math.floor(Math.random() * 10)
            result += randomNumb
        } else { 
             result += letterArray[Math.floor(Math.random() * 10)]
             randomNumb = Math.floor(Math.random() * 10);
         }
 
    }return result
 }

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new", (req, res) => {
    let templateVars = {user: users[req.cookies["user_id"]]}
    res.render("urls_new", templateVars);
  });

app.get("/hello", (req, res) => {
    let templateVars = { greeting: 'Hello World!', user: req.cookies["user.id"] };
    res.render("hello_world", templateVars);
  });

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]};
    res.render("urls_index", templateVars);
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});
// Adding Routes steps in the git hub
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]] };
    res.render("urls_show", templateVars);
  });

  // Sending HTML step
  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });


app.post("/urls", (req, res) => {
    let short = generateRandomString()
    urlDatabase[short] = req.body.longURL
    res.redirect(`/urls/${short}`); 
  });
  app.get(`/u/:shortUrl`, (req, res) => {
      console.log(urlDatabase[req.params.shortUrl])
      res.redirect(urlDatabase[req.params.shortUrl])
  });
  app.post(`/urls/:shortUrl/delete`, (req, res) =>{
    delete urlDatabase[req.params.shortUrl]
    res.redirect(`/urls`)
  });
  app.post(`/urls/:shortUrl/update`, (req, res) =>{
      urlDatabase[req.params.shortUrl] = req.body.longURL
    res.redirect(`/urls/${req.params.shortUrl}`)
  });
  // login post
  app.post(`/login`, (req, res)=>{
    let loginEmail = req.body.email
    let loginPassword = req.body.password
    let authenticateUser = (loginEmail, loginPassword) => {
        for (userId in users) {
            let currentUser = users[userId]
            if (currentUser.email === loginEmail && currentUser.password === loginPassword) {
                res.cookie('user_id',currentUser.id)
                res.redirect("/urls")
                return;
            } if (currentUser.email !== loginEmail){
                return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
            } if (currentUser.password !==loginPassword){
                return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
            }
        }
    }
    authenticateUser(loginEmail,loginPassword)
});

  // logout post
  app.post(`/logout`, (req, res)=>{
    res.clearCookie("user_id")
    res.redirect("/urls")
});
// get web rendering for the registration page
app.get("/register", (req, res) => {
    let templateVars 
    res.render("registration", templateVars);
});
//post for account registrations
app.post(`/register`, (req, res)=>{
    let createID = generateRandomString()
    let newUser = { id: createID, email: req.body.email, 
        password: req.body.password 
    }
    let regEmail = req.body.email
    let authenticateUser = (regEmail) => {
        for (userId in users){
            let currentUser = users[userId]  
            if (currentUser.email === regEmail){
                return res.send("<html><body>Email already exist in <b>400</b></body></html>\n")
        }
}//for loop bracket
    }
    if (req.body.email === "" || req.body.password === ""){
        return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
    } else {
         users[createID] = newUser
         res.cookie("user_id", createID) 
//res.cookie('cookieName', 'cookieValue')

        res.redirect("/urls")
    }
authenticateUser(req.body.email)
});
app.get("/login", (req, res) => {
    let templateVars = {user: users[req.cookies["user_id"]]}
    res.render("login", templateVars);
  });



  //post from login page not working
//   app.post(`/login`, (req, res)=>{
//       console.log(req.body)
//       if(req.body.email === users.email && 
//         eq.body.password === users.password){

//       } if () 
//     res.redirect("/urls")
// });

//listen
app.listen(PORT, () => {
    
    console.log(`Example app listening on port ${PORT}!`);
  });
