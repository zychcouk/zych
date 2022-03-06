// body parser
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
fs = require('fs');
// if you have a public dir with static scripts and styles
app.use(express.static('public'));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// path for the ejs folder
const path = require("path");

app.set("views", path.join(__dirname));
app.set("view engine", "ejs");

// gray-matter to read the .md files better
const matter = require('gray-matter');

app.get("/:article", (req, res) => {
let file
  // read the markdown file
  try{
  file = matter.read(__dirname + '/articles/' + req.params.article + '.md');}

  catch (e){
   res.redirect('/');
  }
  
  // use markdown-it to convert content to HTML
  var md = require("markdown-it")();
  let content = file.content;
  var result = md.render(content);

  res.render("index", {
    post: result,
    title: file.data.title,
    description: file.data.description,
    image: file.data.image,
    created: file.data.created
  });
});


  app.get("/", (req, res) => {
    const posts = fs.readdirSync(__dirname + '/articles').filter(file => file.endsWith('.md'));

    res.render("blog", {
      posts: posts,
    });
  });



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })