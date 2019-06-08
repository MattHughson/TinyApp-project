var express = require("express");
var cookieParser = require('cookie-parser'); //cookie parser request
var app = express();
app.use(cookieParser());
const bcrypt = require('bcrypt')
var PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //Installing and Setting Up EJS

//dataBase for the short URLS
var urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
// user database
// maybe change the key to accesss the id
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
  var chkkCookies = req.cookies.user_id
     if (Object.entries(chkkCookies).length === 0){
      return res.redirect("/urls")
    } else {
      console.log(users[req.cookies["user_id"]])
      let templateVars = {user: users[req.cookies["user_id"]]}
      res.render("urls_new", templateVars);
    }
  });

app.get("/hello", (req, res) => {
    let templateVars = { greeting: 'Hello World!', user: req.cookies["user.id"] };
    res.render("hello_world", templateVars);
  });

app.get("/urls", (req, res) => {
  //let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL}
  //after i add new urls
  var filterURLS
  var chkCookies = req.cookies.user_id
  //*******filter URL Function ************ */
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
  //*******filter URL Function ************ */
   if(chkCookies){
    filterURLS = filter(urlDatabase)
  }
   let templateVars = { urls: filterURLS, user: users[req.cookies["user_id"]]};
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
    var chkkCookies = req.cookies.user_id;
      if (chkkCookies === undefined) {
       return res.redirect("/urls")
     } else {
  console.log("lol", urlDatabase[req.params.shortURL].longURL)

    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies["user_id"]] };
    res.render("urls_show", templateVars);
    }
  });

  // Sending HTML step
  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.post("/urls", (req, res) => {
    let short = generateRandomString()
    console.log(urlDatabase)
    urlDatabase[short] = {longURL: req.body.longURL, userID: req.cookies.user_id};
    console.log(urlDatabase)
    res.redirect(`/urls/${short}`); 
  });
  app.get(`/u/:shortUrl`, (req, res) => {

      res.redirect(urlDatabase[req.params.shortUrl].longURL)
    
  });
  // ************** delete post ***********************
  app.post(`/urls/:shortUrl/delete`, (req, res) =>{
    var chkkCookies = req.cookies.user_id;
      if (chkkCookies === undefined) {
       return res.redirect("/urls")
      } else {
    delete urlDatabase[req.params.shortUrl]
    res.redirect(`/urls`)
      }
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
            let searchBcrypt = bcrypt.compareSync(loginPassword, currentUser.password)
            console.log("curentuseremail", currentUser.email)
            console.log("curentuser", currentUser)
            console.log("CP", currentUser.password)
            console.log("sB", searchBcrypt)
            if (currentUser.email === loginEmail && searchBcrypt === true)
             {
            //bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword); formula
                res.cookie('user_id',currentUser.id)
                res.redirect("/urls")
                return;
            }
          }
           //(currentUser.email !== loginEmail)check if email is wrong
            
                return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
            // } if (currentUser.password !==loginPassword){
            //     return res.status(400).send("<html><body>Error status code password <b>400</b></body></html>\n")
             
       
                 
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
    let authenticateUser1 = (regEmail) => {
        for (userId in users){
            let currentUser = users[userId] 
            if (currentUser.email === regEmail){
                return true
            }
        }
    }
    console.log("regemail", req.body.email )
    if (authenticateUser1(req.body.email) === true){
        return res.status(400).send("<html><body> Email Already exist!!! <b>400</b></body></html>\n")
    }
    let createID = generateRandomString()
    const passwordReg = req.body.password;
    console.log("passwordReg", passwordReg)
    const hashedPassword = bcrypt.hashSync(passwordReg, 10);
    console.log("hasedp", hashedPassword)

    let newUser = { id: createID, email: req.body.email, 
        password: hashedPassword } //obj bracket
    
    if (req.body.email === "" || req.body.password === ""){
        return res.status(400).send("<html><body>Error status code <b>400</b></body></html>\n")
    } else {
         users[createID] = newUser
         console.log("newObjnewuser", newUser)
         console.log("users", users[createID])
         res.cookie("user_id", createID) 
          res.redirect("/urls")
    }

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
