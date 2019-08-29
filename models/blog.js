var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    title: String,
    img: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Blog", blogSchema);