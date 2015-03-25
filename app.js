var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var sign = require('./routes/sign');
var admin = require('./routes/admin');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var expressSession = require('express-session');
var app = express();
var UserManagement = require('user-management');
var easymongo = require('easymongo');
var mongo = new easymongo('mongodb://localhost/user_management');
var USER = mongo.collection('users');

function VerifyCredential(USERNAME, PASSWORD, done)
{
    var users = new UserManagement();

    users.load(function(err) {
        users.authenticateUser(USERNAME, PASSWORD, function(err, result) {
            if (err) {users.close(); return (err);}
            if (!result.userExists)
            {
                users.close();
                return done(null, false);
            }
            if (!result.passwordsMatch)
            {
                users.close();
                return done(null, false);
            }
            USER.findOne({username : USERNAME}, function(err, new_user) {
                users.close();
                mongo.close();
                done(null, new_user);
            })
        });
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession( {
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(VerifyCredential));

passport.serializeUser(function(user, done) {
    var users = new UserManagement();

    users.load(function(err) {
        if (err) {users.close(); return (err);}
        users.getTokenForUsername(user.username, function(err, token) {
            if (err) {users.close(); return (err);}
            users.close();
            done(null, token);
        });
    });
});

passport.deserializeUser(function(token, done) {
    var users = new UserManagement();

    users.load(function(err) {
        if (err) {users.close(); return (err);}
        users.getUsernameForToken(token, function(err, username) {
            if (err) {users.close(); return (err);}
            users.close();
            done(null, username);
        })
    });

});

// Router path
app.use('/', routes);
app.use('/sign', sign);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
