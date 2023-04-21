const User = require('../models/user');
const fs = require('fs');
const path = require('path');
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
