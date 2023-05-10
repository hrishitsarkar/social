const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

module.exports.create = async function(req,res){
    try{
        let posts = await Post.create({
            content : req.body.content,
            user : req.user._id
        });
        posts.user = await User.findById(req.user._id);
        if(req.xhr){
            //if req is xhr then return json with status 200
            return res.status(200).json({
                data : {
                    post : posts
                
                },
                message : "post created"

            });
        }
        req.flash('success','Post Created');
        return res.redirect('back');
    }
    catch(err){
        console.log(`error in creating posts ${err}`);
    }
}



module.exports.destroy = async function(req,res){
    console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    console.log(req.params.id);
    console.log(req);
    try{
        let post = await Post.findById(req.params.id);
    
        //to check if the user and who created the post is same

        // .id will automatically convert obj id into string
        if(post.user == req.user.id){
            try{
                
                post.deleteOne();
                let comment = await Comment.deleteMany({post : req.params.id});
                //delete likes of the posts
                let likePost = await Like.deleteMany({likeable : post},{onModel : 'Post'});
                //delete likes of the comments of the post as well
                let likeComment = await Like.deleteMany({_id : {$in : post.comments}});

                
                if(req.xhr){
                    return res.status(200).json({
                        data :{
                            post_id : req.params.id
                        },
                        message : "post deleted"
                    });
                }
                
                req.flash('success','Post Deleted Successfully with Comments');
                return res.redirect('back');
            }
            catch(err){
                console.log('error in deleting comment',err);
            };
        }else{
            res.redirect('back');
        }

    }
    catch(err){
        console.log(err,'error in finding post');
    }
}