const Comment = require('../models/comment');


const Post = require('../models/post');

const User = require('../models/user');


module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        try {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            //to update
            post.comments.push(comment);
            //to save the updated part
            post.save();
            if(req.xhr){
                await comment.populate('user');
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
        if (comment.user == req.user.id) {

            let postId = comment.post;
            comment.deleteOne();

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