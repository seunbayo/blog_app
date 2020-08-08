//adding body parser
var bodyParser = require("body-parser"),
//adding mongoose
mongoose       = require("mongoose"),
//adding express
express = require("express"),
app = express();

mongoose.connect("mongodb://localhost/restful_blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//Add files from views
app.set("view engine", "ejs");
//add files from public directory
app.set(express.static("public"));
//use body parser
app.use(bodyParser.urlencoded({encoded: true}));



// title
// Image
// body
// created







app.listen(3000, function() {
    console.log('server is up');
    
})