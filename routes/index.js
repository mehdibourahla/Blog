var express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

router.get('/',function(req,res){
    res.render("/blogs");
});

router.get('/register',function(req,res){
    res.render("register");
});

router.post('/register',function(req,res){
    var type = 'admin';
    User.count({},function(err,count){
        if(err){
            console.log(err);
        }
        else{
            if(count >= 1){
                type = 'follower';
            }
            User.register(new User({username: req.body.username, email: req.body.email, type:type}), req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    return res.render("register");
                }
                passport.authenticate("local")(req,res,function(){
                    req.flash("success", "Welcome "+req.user.username+" You have signed up succefully");
                    res.redirect("/blogs");
                });   
            });
        }
    })
});

router.get('/login',function(req,res){
    res.render('login');
});

router.post('/login',passport.authenticate("local",{
    successRedirect: "/blogs",
 	failureRedirect: "/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout(); //Tells passport to erase all data we have in this session
    req.flash("success", "Succefully logged you out, Have a good day!");
    res.redirect('/blogs') //Redirect
   });

module.exports = router;