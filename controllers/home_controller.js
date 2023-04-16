const { populate } = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 66);

    
//populating user

try{
//find all the posts
let posts = await Post.find({})
//populate user of post schema
.populate('user')
//populate comments of post Schema and then populate user inside comment schema
.populate({
    path : 'comments',
    populate :{
        path : 'user'
    }
});

        
let users = await User.find({});

return res.render('home', {
        title: "Home",
        posts:posts,
        //sending user to the view
        all_users : users
});
}
catch(err){
    console.log(`error ${err}`);
    return;
}

    
}

// module.exports.actionName = function(req, res){}