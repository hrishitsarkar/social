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
module.exports.destroy = function(req,res){
    Comment.findById(req.params.id)
    .then((comment)=>{
        if(comment.user == req.user.id){

            let postId = comment.post;
            comment.deleteOne();

            Post.findOneAndUpdate(postId,{ $pull : {comments : req.params.id}}).then((post)=>{
                return res.redirect('back');
            }).catch((err)=>{console.log(err,'in updating post')});

        }
        else{
            return res.redirect('back');
        }
    }).catch((err)=>{console.log(err,'in finding comment')});
}