const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const resetPasswordMailer = require('../mailers/sendEmail');
const Friendship = require('../models/friendship');

const randomstring = require('randomstring');
const nodemailer = require('../config/nodemailer');
module.exports.profile = async function (req, res) {
    let users = await User.findById(req.params.id);
    return res.render('user_profile', {
        profile_user: users,
        title: 'User'
    });
}
//rendering sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}
//rendering sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}
//getting the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }).then(() => {
                return res.redirect('/users/sign-in');
            }).catch((err) => console.log(err, 'error in creating'));
        }
        else {
            return res.redirect('back');
        }
    }).catch((err) => console.log(err, 'error in finding'));
}
//sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    console.log(res.locals.user);
    // console.log(res.locals.user.name);
    return res.redirect('/');
}

module.exports.destroySession = function (req, res, next) {

    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'You have logged out');
        return res.redirect('/');
    });


}
module.exports.update = async function (req, res) {
    // if(req.user.id == req.params.id){
    //     let updatedUsers = await User.findByIdAndUpdate(req.params.id,req.body);
    //     return res.redirect('back');
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('************Multer Error', err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    //if path and also the file exists or not
                    if (user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } catch (err) {
            console.log(err);
            return res.redirect('back')
        }
    }
    else {
        return res.status(401).send('Unauthorized');
    }

}

module.exports.forget = async function (req, res) {
    try {
        return res.render('email');
    } catch (error) {
        console.log(error);
    }

}
module.exports.sendLink = async function (req, res) {

    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const randomString = randomstring.generate();

            const updatedData = await User.updateOne({ email: email }, { $set: { token: randomString } });
            resetPasswordMailer.sendEmail(userData.name, userData.email, randomString);
            res.redirect('back');

        } else {
            return res.render('email');
        }

    } catch (error) {
        console.log(error);
    }

}
module.exports.verify = async function (req, res) {
    try {
        const token = req.query.token;

        const tokenData = await User.findOne({token : token});
        console.log('token data by me',tokenData)
        if(tokenData){
            return res.render('forget-password',{
                user_id : tokenData._id
            })
        }else{
            return res.render('404');
        }
    } catch (error) {
        console.log(error);
    }


}
module.exports.resetPassword = async function(req,res){
    try {
        if(req.body.password != req.body.cnf_password){
            return res.redirect('back');
        }
        else{
            const password = req.body.password;
            const user_id = req.body.user_id;
             
            const updatedData = await User.findByIdAndUpdate({_id : user_id},{$set : {password : password, token : ''}});
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.addFriend = async function(req,res){
    try {
        const friend = await User.findById(req.params.id);
        // console.log("my id",req.user.id);
        const me = await User.findById(req.user.id);
        if(!friend.friendships.includes(req.user.id)){
            await Friendship.create({
                from_user : req.user.id,
                to_user : req.params.id,
                friendName : friend.name
            });
            await me.updateOne({$push : {friendships : req.params.id}});
            await friend.updateOne({$push : {friendships : req.user.id}});
            
            return res.redirect('back');
        }else{
            console.log("you already made friend");
        }

    } catch (error) {
        console.log(error);
    }
}
// module.exports.friends = async function (req, res) {
//     try {
//         let friends = await Friendship.find({from_user : req.user._id});
//         console.log('frand',friends);
//         return res.render('home',{
//             all_friends : friends
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }