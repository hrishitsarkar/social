const { populate } = require('../models/comment');
const Friendship = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 66);

    
//populating user

try{
//find all the posts
//populate the likes of each post and comments
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
    },
    populate : {
        path : 'likes'
    }
}
).populate({
    path : 'likes'
});

let users = await User.find({});
// let signedInUsers = await User.find({_id : req.user._id});
// console.log("me",signedInUsers);
// let friends;

// signedInUsers.forEach((element)=>{
//      friends =  element.friendships;
     
   
// });
// console.log(friends);



// let signedInUser = await User.findOne({_id : req.user._id});
// console.log(signedInUser);
// console.log("userid",req.user._id);

// let friends = await Friendship.find({from_user : req.user._id});

// console.log("fr",friends,req.user._id);

return res.render('home', {
        title: "Home",
        posts:posts,
        //sending user to the view
        all_users : users,
        // all_friends : friends
        // all_friends : friends
});
}
catch(err){
    console.log(`error ${err}`);
    return;
}

    
}

// module.exports.actionName = function(req, res){}