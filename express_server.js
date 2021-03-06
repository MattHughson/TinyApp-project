var express = require("express");
var app = express();
//***************cookie session ************************** */
var cookieSession = require('cookie-session'); 
app.use(cookieSession({
  name: 'session',
  keys: ['keys1', 'keys2']
}))

//***************BCRYPT***************************************** */

const bcrypt = require('bcrypt')
var PORT = 8080; // default port 8080

app.set("view engine", "ejs"); 

var urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
//************************************************************* */

const users = { 
    "aJ48lW": {
      id: "aJ48lW", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  }
//********************random key gernerator************************************************* */

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
//***************************body parser***************************************** */
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//*************************** get urls/new *************************************** */
app.get("/urls/new", (req, res) => {
  let chkkCookies = req.session.user_id
     if (chkkCookies === undefined){
      return res.redirect("/urls")
    } else {
      let templateVars = {user: users[req.session.user_id]}
      res.render("urls_new", templateVars);
    }
  });
//**************************hello world****************************************** */
app.get("/hello", (req, res) => {
    let templateVars = { greeting: 'Hello World!', user: req.session.user.id };
    res.render("hello_world", templateVars);
  });
//*****************************get /urls ************************************************ */
app.get("/urls", (req, res) => {
  //let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL}
  //after i add new urls
  var filterURLS
  var chkCookies = req.session.user_id
  //******* start filter URL Function **************************************** */
  function filter (obj){
    let userid = chkCookies
    var newObj = []
    var tempURL
    var tempShortURL
    for (var keys in obj){
      if (obj[keys].userID === userid) {
        tempURL = obj[keys].longURL
        tempShortURL = keys
        newObj.push({[tempShortURL]: tempURL})
      }
    }
    return newObj
  }
  //********************** end filter URL Function ************ */
   if(chkCookies){
    filterURLS = filter(urlDatabase)
  }
   let templateVars = { urls: filterURLS, user: users[req.session.user_id]};
    res.render("urls_index", templateVars);
  });
//******************** get hello *********************************************** */
app.get("/", (req, res) => {
  res.send("Hello!");
});

//******************* */Adding Routes steps in the git hub**************************
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  //*************************Short URL ************************************************* */

  app.get("/urls/:shortURL", (req, res) => {
    var chkkCookies = req.session.user_id;
      if (chkkCookies === undefined) {
       return res.redirect("/urls")
     } else {

    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id] };
    res.render("urls_show", templateVars);
    }
  });

  // ************* Sending HTML step  hello ******************************
  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  //************************ adds url to database ***************************************************** */
app.post("/urls", (req, res) => {
    let short = generateRandomString()
    urlDatabase[short] = {longURL: req.body.longURL, userID: req.session.user_id};
    res.redirect(`/urls/${short}`); 
  });
 //**************** */short url redirect *****************************************************

  app.get(`/u/:shortUrl`, (req, res) => {
      res.redirect(urlDatabase[req.params.shortUrl].longURL)
    
  });
  // ************** delete post ***********************
  app.post(`/urls/:shortUrl/delete`, (req, res) =>{
    var chkkCookies = req.session.user_id;
      if (chkkCookies === undefined) {
       return res.redirect("/urls")
      } else {
    delete urlDatabase[req.params.shortUrl]
    res.redirect(`/urls`)
      }
  });
  //********************post update *************************** */

  app.post(`/urls/:shortUrl/update`, (req, res) =>{
    urlDatabase[req.params.shortUrl].longURL = req.body.longURL
    res.redirect(`/urls/${req.params.shortUrl}`)
  
});

  // *************login post***********************************************************
  app.post(`/login`, (req, res)=>{
    let loginEmail = req.body.email
    let loginPassword = req.body.password
    let authenticateUser = (loginEmail, loginPassword) => {
        for (userId in users) {
            let currentUser = users[userId]
            let searchBcrypt = bcrypt.compareSync(loginPassword, currentUser.password)
            if (currentUser.email === loginEmail && searchBcrypt === true)
             {
                req.session.user_id = currentUser.id
                res.redirect("/urls")
                return;
              }
            }
            
                return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
              }
              authenticateUser(loginEmail,loginPassword)
            });

  // ****************logout post********************************************************
  app.post(`/logout`, (req, res)=>{
    req.session = null
    res.redirect("/urls")
});
// ******************get web rendering for the registration page******************************
app.get("/register", (req, res) => {
    let templateVars 
    res.render("registration", templateVars);
});
//*************** */post for account registrations *****************************************
app.post(`/register`, (req, res)=>{
    let authenticateUser1 = (regEmail) => {
        for (userId in users){
            let currentUser = users[userId] 
            if (currentUser.email === regEmail){
                return true
              }
            }
          }
          if (authenticateUser1(req.body.email) === true){
            return res.status(400).send("<html><body> Email Already exist!!! <b>400</b></body></html>\n")
          }
          let createID = generateRandomString()
          const passwordReg = req.body.password;
          const hashedPassword = bcrypt.hashSync(passwordReg, 10);
          let newUser = { id: createID, email: req.body.email,
            password: hashedPassword }
            if (req.body.email === "" || req.body.password === ""){
              return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
            } else {
              users[createID] = newUser
              req.session.user_id = createID
              res.redirect("/urls")
            }
          });
// ******************************* login get ******************************************************************
app.get("/login", (req, res) => {
    let templateVars = {user: users[req.session.user_id]}
    res.render("login", templateVars);
  });

app.listen(PORT, () => {
    
    console.log(`Example app listening on port ${PORT}!`);
  });
