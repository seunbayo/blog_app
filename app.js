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
app.set(express.static("public"));
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

// Blog.create
//   title: "Test Blog",
//   image: "https://live.staticflickr.com/4567/37514240304_1a744f1fce_z.jpg",
//   body: "This is a post from the Blog",
// ;

// ROUTES
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

// title
// Image
// body
// created

app.listen(3000, function () {
  console.log("server is up");
});
