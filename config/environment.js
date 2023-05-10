const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path : logDirectory
})


const development = {
    name : 'development',
    asset_path : 'assets',
    session_cookie_key : 'blahsomething',
    db : 'codeial_development',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : true,
        auth : {
            user : 'hrishittherock@gmail.com',
            pass : 'ujeubmiwbgrsiw'
        }
    
    
    },
    google_client_id: "722303274739-fb7to27iuh5js2qomn79vuf2dtu3lrq5.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret : 'codeial',
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}
    }

    
}



const production = {
    name : 'production',
    asset_path : process.env.CODEIAL_ASSET_PATHS,
    session_cookie_key : process.env.CODEIAL_SESSION_KEY,
    db : process.env.CODEIAL_DB,
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : true,
        auth : {
            user : process.env.CODEIAL_GMAIL_USERNAME,
            pass : process.env.CODEIAL_GMAIL_PASSWORD
        }
    
    
    },
    google_client_id : process.env.CODEIAL_GOOGLE_CLIENT_ID ,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret : process.env.CODEIAL_JWT_SECRET,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}
    }
    
}

console.log(process.env.CODEIAL_ASSET_PATHS);
module.exports = production;