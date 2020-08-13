//adding body parser
var bodyParser = require("body-parser"),
  //adding method override
  methodOverride = require("method-override");
//adding mongoose
(mongoose = require("mongoose")),
mongoose.set('useFindAndModify', false);
  //adding express
  (express = require("express")),
  (app = express());

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//Add files from views
app.set("view engine", "ejs");
//add files from public directory
app.use(express.static(__dirname + "/public"));
//use body parser
app.use(bodyParser.urlencoded({ extended: true }));
//use method override
app.use(methodOverride("_method"));

//MONGOOSE CONFIG

//creating a schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

//INDEX ROUTE
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  //RETRIEVE ALL  BLOG FROM DATABASE
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("ERROR");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
  res.render("new");
});
//CREATE ROUTE
app.post("/blogs", function (req, res) {
  //create blog
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //then redirect to index page
      res.redirect("blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});


//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});



app.listen(3000, function () {
  console.log("server is up");
});
