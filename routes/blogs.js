var express             = require('express'),
    Blog                = require('../models/blog'),
    middleware          = require('../middleware'),
    router              = express.Router({mergeParams:true});

//LIST ALL BLOGS
router.get('/',function(req,res){
    console.log(req.user);
    Blog.find({},function(err,blogs){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            res.render("blogs/index",{blogs:blogs});
        }
    });
    
});

//SHOW NEW BLOG FORM
router.get('/new',middleware.isAdmin,function(req,res){
    res.render("blogs/new");
});

//CREATE NEW BLOG
router.post('/',middleware.isAdmin,function(req,res){
    var sanitizedDesc = req.sanitize(req.body.blog.description);
    req.body.blog.description = sanitizedDesc;
    var blog = req.body.blog;
    Blog.create(blog,function(err,createdBlog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            req.flash("success", "A new blog has been created succefully");
            res.redirect('/blogs');
        }
    })
    
});

//SHOW BLOG
router.get('/:id',function(req,res){
    
    Blog.findById(req.params.id).
    populate({path:'comments', populate:{path:'author'}}).exec(function(err,blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            res.render("blogs/show",{blog:blog});
        }
    })
});

//SHOW EDIT FORM
router.get('/:id/edit',middleware.isAdmin,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            res.render("blogs/edit",{blog:blog});
        }
    });    
});

//UPDATE BLOG
router.put("/:id",middleware.isAdmin, function(req, res){
    var sanitizedDesc = req.sanitize(req.body.blog.description);
    req.body.blog.description = sanitizedDesc;
    var blog = req.body.blog;
    Blog.findByIdAndUpdate(req.params.id, blog, function(err, blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        } else {
          req.flash("success", "The Blog has been edited succefully");
          var showUrl = "/blogs/" + blog._id;
          res.redirect(showUrl);
        }
    });
 });

 //DELETE BLOG
 router.delete("/:id",middleware.isAdmin,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        req.flash("success", "The blog has been deleted succefully");
        res.redirect("/blogs");
    })
 });

module.exports = router;