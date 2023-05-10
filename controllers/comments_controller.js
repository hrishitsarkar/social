const Comment = require('../models/comment');


const Post = require('../models/post');

const User = require('../models/user');

const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');

const commentEmailWorker = require('../workers/comment_email_worker');

const queue = require('../config/kue');




module.exports.create = async function (req, res) {
    try {
        
        console.log(req.body.post);
        
        
        let post = await Post.findById(req.body.post);
        console.log(post);
        
        try {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: post._id,
            });
            //to update
            post.comments.push(comment);
            //to save the updated part
            post.save();
            await comment.populate('user','name email');
            // commentsMailer.newComment(comment);

            let job = queue.create('emails',comment).save(function(err){
                if(err) {
                    console.log('error in sending to the queue',err);
                    return;
                }
                console.log(job.id,'job enqueued')
            })

            if(req.xhr){
                
                return res.status(200).json({
                    data : {
                        comments : comment
                    },
                    message : "comment created and updated"
                }) 
            }
            req.flash('success', 'You Commented');
            res.redirect('/');

        } catch (err) {
            console.log(err, 'in creating comment');
        }
    } catch (err) {
        console.log(err, 'in finding post');
    }
}
module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        console.log(req.params.id,"commentid");
        if (comment.user == req.user.id) {

            let postId = comment.post;
            comment.deleteOne();
            //delete the likes of the comments
            let commentLike = await Like.deleteMany({likeable : comment._id,onModel : 'Comment'});

            let post = await Post.findOneAndUpdate(postId, { $pull: { comments: req.params.id } });
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        comment_id : req.params.id
                    },
                    message : "comment deleted"
                })
            }
            req.flash('success', 'comment deleted');
            return res.redirect('back');

        }
        else {
            return res.redirect('back');
        }
    } catch (err) { console.log('error', err) };


}