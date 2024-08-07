//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser"); // Can be replaced with express built-in body parser
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

// Updated to use express's built-in body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Creating connection to database
mongoose.connect(process.env.MONGODB_URI);


const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

let posts = [];

app.get("/", async function(req, res){
  try{
    const posts = await Post.find({});
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
    });
  } catch (err){
    console.log(err);
  }
});

app.get("/about", function(req, res){
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res){
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try{
    await post.save();
    res.redirect("/");
  } catch (err){
    console.log(err);
  }
});

app.get("/posts/:postId", async function(req, res){
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId }); // Updated to use async/await for Post.findOne()
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching the post");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
