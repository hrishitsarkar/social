const Comment = require('../models/comment');


const Post = require('../models/post');


module.exports.create = function(req,res){
    Post.findById(req.body.post).then((post)=>{
        Comment.create({
            content : req.body.content,
            user : req.user._id,
            post : req.body.post
        }).then((comment) => {
            //to update
            post.comments.push(comment);
            //to save the updated part
            post.save();
            res.redirect('/');
        }).catch((err)=>{
            console.log(err,'in creating comment');
        })
    }).catch((err) => {
        console.log(err, 'in finding post');
    })
}