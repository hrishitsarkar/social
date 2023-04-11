const { populate } = require('../models/comment');
const Post = require('../models/post');
module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 66);

    
//populating user


//find all the posts
    Post.find({})
    //populate user of post schema
    .populate('user')
    //populate comments of post Schema and then populate user inside comment schema
    .populate({
        path : 'comments',
        populate :{
            path : 'user'
        }
    })
    .exec().then((posts)=>{
        
            
            return res.render('home', {
                title: "Home",
                posts:posts
            });
        
    }).catch((err)=>{
        console.log(`err : ${err}`);
    });
    
}

// module.exports.actionName = function(req, res){}