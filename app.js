var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  passport = require("passport"),
  session = require("express-session"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("./models/user"),
  express = require("express"),
  app = express(),
  //adding mongoose
  mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

//APP CONFIG
//MONGOOSE CONFIG
var mongoDbUrl = "mongodb://localhost/blog_app";
if (process.env.MONGODB_URL) {
  mongoDbUrl = process.env.MONGODB_URL;
}
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//Add files from views
app.set("view engine", "ejs");
//add files from public directory
app.use(express.static(__dirname + "/public"));
//use body parser
app.use(bodyParser.urlencoded({ extended: true }));
//use sanitizer
app.use(expressSanitizer());
//use method override
app.use(methodOverride("_method"));

//creating a schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

//PASSPORT CONFIGURATION
app.use(
  session({
    secret: "rusty is cute",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//====================================
//INDEX ROUTE
//====================================
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  //RETRIEVE ALL  BLOG FROM DATABASE
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
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
  console.log(req.body);
  console.log("========");
  console.log(req.body);

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
app.get("/blogs/:id/edit", isLoggedIn, function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE

app.delete("/blogs/:id", isLoggedIn, function (req, res) {
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

//===================================
//Auth Route
//==================================

//show register form
app.get("/register", function (req, res) {
  res.render("register");
});

//Sign up LOGIC
app.post("/register", function (req, res) {
  var newUser = new User({
    email: req.body.email,
    username: req.body.username,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/blogs");
    });
  });
});

// show login form
app.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//LogOut route
app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/blogs");
});

//middleware for must login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

var port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
}

app.listen(port, function () {
  console.log("server is up");
});
