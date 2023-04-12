const Post = require('../models/post');

const Comment = require('../models/comment');
const mongoose = require('mongoose');

module.exports.create = function(req,res){
Post.create({
    content : req.body.content,
    user : req.user._id
}).then(()=>{
    return res.redirect('back');
}).catch((err) => console.log(`error in creating post`));
}

module.exports.destroy = function(req,res){
    console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    console.log(req.params.id);

    Post.findById(req.params.id)
    .then((post)=>{
        //to check if the user and who created the post is same

        // .id will automatically convert obj id into string
        if(post.user == req.user.id){
            post.deleteOne();
            Comment.deleteMany({post : req.params.id}).then(()=>{
                return res.redirect('back');
            }).catch((err)=>{
                console.log('error in deleting comment',err);
            });
        }else{
            res.redirect('back');
        }


    }).catch((err)=> {
        console.log(err,'error in finding post');
    })
}