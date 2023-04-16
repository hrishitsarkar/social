const Comment = require('../models/comment');


const Post = require('../models/post');


module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        try{
            let comment = await Comment.create({
                content : req.body.content,
                user : req.user._id,
                post : req.body.post
            });
                //to update
            post.comments.push(comment);
                //to save the updated part
                post.save();
                res.redirect('/');
        }catch(err){
            console.log(err,'in creating comment');
        }
    }catch(err){
        console.log(err, 'in finding post');
    }
}
module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){

            let postId = comment.post;
            comment.deleteOne();
            
                let post = await Post.findOneAndUpdate(postId,{ $pull : {comments : req.params.id}});
                return res.redirect('back');
            
        }
        else{
            return res.redirect('back');
        }
    }catch(err){console.log('error',err)};
    
    
}