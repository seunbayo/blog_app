var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express = require("express"),
app = express();

mongoose.connect("mongodb://localhost/restful_blog_app")
// title
// Image
// body
// created
