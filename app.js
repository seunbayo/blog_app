//adding body parser
var bodyParser = require("body-parser"),
  //adding mongoose
  mongoose = require("mongoose"),
  //adding express
  express = require("express"),
  app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//Add files from views
app.set("view engine", "ejs");
//add files from public directory
app.use(express.static(__dirname + '/public'));
//use body parser
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get("/blogs/new", function(req, res){
    res.render("new")
});
//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else {
            //then redirect to index page
            res.redirect("blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.listen(3000, function () {
  console.log("server is up");
});
