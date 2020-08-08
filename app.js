const methodOverride    = require("method-override"),
      expressSanitizer  = require("express-sanitizer"),
      express           = require("express"),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      app               = express();

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// First Blog in DB
// Blog.create({
//     title: "A Demo Blog!",
//     image: "https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "hhhjgjds hsgdhjhj sgdhjgbs gdsjbkb jsgdkjbsj guidhsk",
// }, function(err, blog){
//         if(err){
//             console.log("Something went Wrong ...ERROR!!");
//         } else{
//             console.log("A new blog created in DB");
//             console.log(blog);
//         }
//    });

//______________________ RESTful ROUTES ______________________________

app.get("/", function(req, res){
    res.redirect("/blogs");
});


// INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR in finding blogs in DB");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE
app.post("/blogs", function(req, res){
    //sanitizing blog content to remove script tags from it
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
        if(err){
            console.log("ERROR in creating new blog from form!");
            res.render("/blogs/new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW PAGE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // Blog.findByIdAndUpdate(id, data, callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, editedBlog){
        if(err){
            console.log("ERROR");
            res.redirect("/blogs/"+ req.params.id);
        }else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

// DELETE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err, deletedBlog){
        if(err){
            res.redirect("/blogs/" + req.params.id);
        }else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function(){
    console.log("The Blog App Server has Started!");
});
