var express = require('express');
var router = express.Router();
var	passport = require('passport');
var form = require("../form/user");
var UserManagement = require('user-management');
var email = require("../email/email");
var session = require('express-session');
var easymongo = require('easymongo');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('sign');
});

router.post('/', passport.authenticate('local', {failureRedirect: 'sign/new'}),
	function(req, res) {
		var sess = req.session;
		var db = new easymongo('mongodb://localhost/user_management');
		var collection = db.collection('users');
		var role;

		collection.findOne({username: req.body.username}, function(err, result) {
			if (err) {db.close(); return (err);}
			role = result.extras.role;
			db.close();
			sess.username = req.body.username;
			sess.role = role;
			res.redirect('/');
		});
	}
);

router.get('/new', function(req, res) {
	res.render('sign/new', {form: form.UserForms.toHTML()});
});

router.post('/new', function(req, res, form) {
	var data = req.body;
	var USERNAME = data.username;
	var PASSWORD = data.password;
	var EXTRAS = {
		email: data.email,
		role: 'User'
	};
	var myEmail = email(data.email);

	var users = new UserManagement();
	users.load(function(err) {
	  console.log('Checking if the user exists');
	  users.userExists(USERNAME, function(err, exists) {
	    if (exists) {
	      console.log('  User already exists');
	      users.close();
	      res.redirect('./new');
	    } else {
	      console.log('  User does not exist');
	      console.log('Creating the user');
	      users.createUser(USERNAME, PASSWORD, EXTRAS, function (err) {
	        console.log('  User created');
	        users.close();
	        myEmail.SuccessMsg();
	        res.redirect('.');
	      });
	    }
	  });
	});
});

module.exports = router;