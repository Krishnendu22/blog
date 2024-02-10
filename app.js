const express=require("express");
const app=express();
require('dotenv').config();
const ejs=require("ejs");
const api_key=process.env.API_KEY;
const bodyParser=require("body-parser");

var _ = require('lodash');
const mongoose = require('mongoose')
main().catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

const startingText="Press 'COMPOSE' and get started with your blogging!"
const startingContact="You've already got my number!"
const startingAbout="I'm Krishnendu and that's it IG... :-)"





async function main() {


  await mongoose.connect(`mongodb+srv://krish:${api_key}@cluster0.37roixz.mongodb.net/?retryWrites=true&w=majority`);
  console.log("Connected");

  
//creating a schema
const blogSchema= new mongoose.Schema({
  title:String,
  content:String
})

const Blog= mongoose.model("Blog",blogSchema);




app.get("/",function(request,response)
{ Blog.find()
  .then(function(posts){
  response.render("home",{startingContent:startingText,posts:posts})
})
.catch(function(err)
{
  console.log(err);
})
})

app.get("/about",function(request,response)
{
  response.render("about",{aboutText:startingAbout})
})

app.get("/contact",function(request,response)
{
  response.render("contact",{contactText:startingContact})
})

app.get("/compose",function(request,response)
{   
  response.render("compose")
  
})



app.post("/compose",function(request,response)
{
 const userPost=new Blog({
 title:request.body.postTitle,
  content:request.body.postBody
 })
userPost.save();
response.redirect("/");
})

app.get("/posts/:postid",async function(request,response)
{
 const requestedpostid= request.params.postid;
 await Blog.findById(requestedpostid)
 .then(function(post)
 {
  response.render("post",{Title:post.title,Body:post.content})
 })
  
 
  
}
)




app.listen(3000,function()
{
  console.log("Server at port 3000 deployed.")
})



}