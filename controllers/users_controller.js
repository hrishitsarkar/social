const User = require('../models/user');
module.exports.profile = async function(req, res){
    let users = await User.findById(req.params.id);         
    return res.render('user_profile',{               
        profile_user:users,        
        title:'User'       
    });
}
//rendering sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}
//rendering sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
    console.log(res.locals.user);
    // console.log(res.locals.user.name);
    return res.redirect('/');
}

module.exports.destroySession = function(req,res,next){
    req.logout(function(err){
        if(err) return next(err);
        return res.redirect('/');
    });
    
}
module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        let updatedUsers = await User.findByIdAndUpdate(req.params.id,req.body);
        return res.redirect('back');
    }else{
        return res.status(401).send('Unauthorized');
    }

    
}
