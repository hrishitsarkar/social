const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');

const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// app.configure(function() {
//     app.use(express.cookieParser('keyboard cat'));
//     app.use(express.session({ cookie: { maxAge: 60000 }}));
//     app.use(flash());
//   });
//setup the chat server to be user with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");
if(env.name == "development"){
    app.use(sassMiddleware({
        src : path.join(__dirname,env.asset_path,'scss'),
        dest : path.join(__dirname,env.asset_path,'css'),
        debug : true,
        outputStyle : 'extended',
        prefix : '/css'
    }));
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended : false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname,env.asset_path)));

app.use(logger(env.morgan.mode,env.morgan.options));
//make the upload path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))
app.use(expressEjsLayouts);
//extract style and script form sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in db 
app.use(session({
    name : 'codeial',
    //TODO change secret before deployment in production mode
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge : (1000 * 600 * 100)
    },
    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/codeial_development',
        autoRemove : 'disabled'
    },
    function(err){
        console.log(err || 'connct-mongoDB setup ok');
    }
    )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());

app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});