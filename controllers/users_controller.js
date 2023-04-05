const User = require('../models/user');
module.exports.profile = function(req, res){
    return res.render('user_profile',{
        title : 'User'
    });
}
//rendering sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}
//rendering sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}
//getting the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    } 
    User.findOne({email : req.body.email}).then((user)=>{
        if(!user){
           User.create({
            name:req.body.name,
            email : req.body.email,
            password:req.body.password
        }).then(()=>{
            return res.redirect('/users/sign-in');
        }).catch((err)=>console.log(err,'error in creating'));
        }
        else{
            return res.redirect('back');
        }
    }).catch((err) => console.log(err,'error in finding'));
}
//sign in and create a session for the user
module.exports.createSession = function(req,res){
    //find the email
    // User.findOne({email:req.body.email}).then((user)=>{
    //     //user is found
    //     if(user){
    //         //if password matches
    //       if(req.body.password == user.password){
    //          req.cookie('user_id',user._id);
    //          return res.redirect('/users/profile');
    //       }
    //       //if does not match
    //       else{
    //         return res.redirect('back');
    //       }
    //     }
    //     //user is not found
    //     else{
    //       return res.redirect('back');
    //     }
    // }).catch((err)=>{
    //   console.log("error in finding user in signing in");
    //   return;
    // });
}