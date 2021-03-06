var mongoose = require('mongoose');
var commentSchema = mongoose.Schema({
    content: String,
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"  
    }
});
module.exports = mongoose.model("Comment", commentSchema);