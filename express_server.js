var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //Installing and Setting Up EJS


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
    res.render("urls_new");
  });

app.get("/hello", (req, res) => {
    let templateVars = { greeting: 'Hello World!' };
    res.render("hello_world", templateVars);
  });

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
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
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    console.log("LG:", templateVars.longURL)
    console.log("short", templateVars.shortURL)
    res.render("urls_show", templateVars);
  });

  // Sending HTML step
  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.post("/urls", (req, res) => {
    let short = generateRandomString()
  console.log(req.body)

    urlDatabase[short] = req.body.longURL// why is it printing an array?

    console.log("posttest", urlDatabase[short]);  // Log the POST request body to the console
    res.redirect(`/urls/${urlDatabase[short]}`);         // it responds with a redirection to /urls/:shortURL, where shortURL is the random string we generated.
  });
  app.get(`/u/:shortUrl`, (req, res) => {
      console.log(urlDatabase[req.params.shortUrl])
      res.redirect(urlDatabase[req.params.shortUrl])
  });
  app.post(`/urls/:shortUrl/delete`, (req, res) =>{
    delete urlDatabase[req.params.shortUrl]
    res.redirect(`/urls`)
  });