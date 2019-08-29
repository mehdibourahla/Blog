Comment = require('../models/comment');
var middlewareObj = {}

middlewareObj.isAdmin = function(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.type === 'admin'){
            return next();
        }
        else{
            req.flash("danger", "You're not allowed to do that, you must be the admin");
            res.redirect("back");
        }
    }
    else{
        req.flash("danger", "You're not allowed to do that, you must be logged in first");
        res.redirect("/login");
    }
}
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("danger", "You're not allowed to do that, you must be logged in first");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id,function(err,comment){
            if(err){
                req.flash("danger", err.name+" : "+err.message);
                console.log(err);
                res.redirect("back");
            }
            else{
                if(comment.author.equals(req.user._id) || req.user.type === 'admin'){
                    next();
                }
                else{
                    req.flash("danger", "You're not allowed to do that, you don't owe that comment");
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("danger", "You're not allowed to do that, you must be logged in first");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;