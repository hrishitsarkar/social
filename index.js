const express = require('express');
// const cookieParser = require('cookie-parser');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// app.configure(function() {
//     app.use(express.cookieParser('keyboard cat'));
//     app.use(express.session({ cookie: { maxAge: 60000 }}));
//     app.use(flash());
//   });

app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended : false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname,'assets')));
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
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge : (1000 * 60 * 100)
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