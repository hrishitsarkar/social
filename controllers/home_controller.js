const Post = require('../models/post');
module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 66);

    
//populating user
    Post.find({}).populate('user').exec().then((posts)=>{
        
            
            return res.render('home', {
                title: "Home",
                posts:posts
            });
        
    }).catch((err)=>{
        console.log(`err : ${err}`);
    });
    
}

// module.exports.actionName = function(req, res){}