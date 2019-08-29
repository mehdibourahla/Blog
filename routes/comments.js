var express = require('express'),
    Comment = require('../models/comment'),
    Blog    = require('../models/blog'),
    middleware            = require('../middleware'),
    router  = express.Router({mergeParams:true});

//SHOW CREATE FORM
router.get('/new', middleware.isLoggedIn, function(req,res){
    Blog.findById(req.params.blogid).
    populate({path:'comments', populate:{path:'author'}}).exec(function(err,blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            console.log(blog);
            res.render("comments/new",{blog:blog});
        }
    });
});
//CREATE A COMMENT
router.post('/',middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.blogid,function(err,blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            req.body.comment.content = req.sanitize(req.body.comment.content);
            Comment.create(req.body.comment,function(err,createdComment){
                if(err){
                    req.flash("danger", err.name+" : "+err.message);
                    console.log(err);
                }
                else{
                    createdComment.author = req.user._id;
                    createdComment.save();
                    blog.comments.push(createdComment);
                    blog.save();
                    req.flash("success", "The Comment has been added succefully");
                    res.redirect("/blogs/"+blog._id);
                }
            });
        }
    });
    

});

//SHOW COMMENT EDIT FORM
router.get('/:id/edit',middleware.checkCommentOwnership,function(req,res){
    Blog.findById(req.params.blogid).
    populate({path:'comments', populate:{path:'author'}}).exec(function(err,blog){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            Comment.findById(req.params.id, function(err,editComment){
                if(err){
                    req.flash("danger", err.name+" : "+err.message);
                    console.log(err);
                }
                else{
                    req.flash("success", "The Comment has been edited succefully");
                    res.render("comments/edit",{blog:blog, editComment:editComment});
                }
            });
        }
    });
});

//UPDATE FORM
router.put("/:id",middleware.checkCommentOwnership,function(req,res){
    req.body.comment.content = req.sanitize(req.body.comment.content);
    Comment.findByIdAndUpdate(req.params.id,req.body.comment,function(err,comment){
        if(err){
            req.flash("danger", err.name+" : "+err.message);
            console.log(err);
        }
        else{
            req.flash("success", "The Comment has been edited succefully");
            res.redirect("/blogs/"+req.params.blogid);
        }
    });
});

//DELETE A COMMENT
router.delete("/:id",middleware.checkCommentOwnership ,function(req,res){
    
Comment.findByIdAndRemove(req.params.id,function(err){
    if(err){
        req.flash("danger", err.name+" : "+err.message);
        console.log(err);
    }
    else{
        req.flash("success", "The Comment has been deleted succefully");
        res.redirect("/blogs/"+req.params.blogid);
    }
});
});


module.exports = router;
