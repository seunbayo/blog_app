//adding body parser
var bodyParser = require("body-parser"),
//adding mongoose
mongoose       = require("mongoose"),
//adding express
express = require("express"),
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//Add files from views
app.set("view engine", "ejs");
//add files from public directory
app.set(express.static("public"));
//use body parser
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE CONFIG
//creating a schema
var blogSchema = new mongoose.Schema ({
    title: String,
    image: String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

// ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    //RETRIEVE ALL  BLOG FROM DATABASE
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('ERROR');
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    res.render("index");
});




// title
// Image
// body
// created







app.listen(3000, function() {
    console.log('server is up');
    
})