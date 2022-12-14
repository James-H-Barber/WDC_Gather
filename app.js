var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//sessions:
var session = require('express-session');


// use mysql in this app
var mysql = require('mysql');
// create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({ host: '127.0.0.1', database: 'gather'});

var app = express();


// Middleware for accessing database: We need access to the database to be available *before* we process routes in index.js, // so this code needs to be *before* the app.use('/', routes);
// Express will run this function on every request and then continue with the next module, index.js.
// So for all requests that we handle in index.js, we’ll be able to access the pool of connections using req.pool
app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// sessions:
app.use(session({
    secret: 'kommsussertod',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', function(req, res, next) {
    if ( 'user' in req.session ) {
        res.redirect('signed-home/signed-home.html');
    } else {
        next();
    }
})


app.use(express.static(path.join(__dirname, 'public')));

// Middleware for redirecting users who are not logged in
app.use('/accountSettings', function(req, res, next) {
    if ( 'user' in req.session ) {
        return res.sendFile('settings.html', { root: 'private'});
    } else {
        // If user is not in current session, redirect to sign-in
        return res.redirect('/signInCreateAccount/signIn/signin.html');
    }
})


app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
