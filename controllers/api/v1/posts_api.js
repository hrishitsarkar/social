const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
const mongoose = require('mongoose')
module.exports.index = async function(req,res){

    let posts = await Post.find({})
//to sort by created time
.sort('-createdAt')
//populate user of post schema
.populate('user')
//populate comments of post Schema and then populate user inside comment schema
.populate({
    path : 'comments',
    populate :{
        path : 'user'
    }
});
    return res.status(200).json({
        message : 'Lists of posts',
        posts : posts

    })
}
module.exports.destroy = async function(req,res){
    console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    console.log(req.params.id);
    console.log(req);
    try{
        let post = await Post.findById(req.params.id);
    
        //to check if the user and who created the post is same

        // .id will automatically convert obj id into string
        
            
                
                post.deleteOne();
                let comment = await Comment.deleteMany({post : req.params.id});
                
                
                
               
                return res.status(200).json({
                    message : 'posts and associated comments deleted',
                });
            
            
        

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'internal server error'
        })
    }
}