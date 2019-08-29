var Blog = require("./models/blog");
var User = require("./models/user");
var Comment = require("./models/comment");

function seedDB(){
   //Remove all blogs
   Blog.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Blogs!");
         //Remove all comments
        Comment.remove({},function(err){
            if(err){
                console.log(err);
            }
            else{
                //Remove all users
                User.remove({}, function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }
        })
    }); 
}

module.exports = seedDB;
