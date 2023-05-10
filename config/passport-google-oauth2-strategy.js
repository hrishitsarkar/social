const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('./environment');
const User = require('../models/user');

//tell passport to use a new strategy for google log in
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
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