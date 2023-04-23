const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google log in
passport.use(new googleStrategy({
    clientID: "722303274739-fb7to27iuh5js2qomn79vuf2dtu3lrq5.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},

    //if accessToken expires we can get it new by refreshToken
    async function (accessToken, refreshToken, profile, done) {
        try {
            //find a user
            let user = await User.findOne({ email: profile.emails[0].value });
            console.log(profile);
            console.log('access',accessToken);
            if(user){
                //if found set the user as req.user
                return done(null,user);
            }else{
                //if not found create the user and set it as req.user
                try{
                    let user = await User.create({
                        name : profile.displayName,
                        email : profile.emails[0].value,
                        password : crypto.randomBytes(20).toString('hex') //20 length password in hex format
                    });
                    return done(null,user);
                }catch(err){
                    console.log('error in creating user google passport',err);
                    return;
                }
            }
        }catch(err){
            console.log('error in google strategy passport',err);
            return;
        }
        
    }
))