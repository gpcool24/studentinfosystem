var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


router.get('/register', function(req, res){
	res.render('register');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/home', function(req, res){
	res.render('home');
});

router.get('/dashboard', function(req, res){
	res.render('dashboard');
});

router.get('/academics', function(req, res){
	res.render('academics');
});

router.get('/calender', function(req, res){
	res.render('calender');
});

router.get('/class_schedule', function(req, res){
	res.render('class_schedule');
});

router.get('/examination', function(req, res){
	res.render('examination');
});

router.get('/assignments', function(req, res){
	res.render('assignments');
});

router.get('/library', function(req, res){
	res.render('library');
});

router.get('/attendance', function(req, res){
	res.render('attendance');
});

router.get('/fee_details', function(req, res){
	res.render('fee_details');
});

router.get('/notice', function(req, res){
	res.render('notice');
});

router.get('/news_events', function(req, res){
	res.render('news_events');
});

router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name', 'Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();
	req.checkBody('password2', 'Passwords does not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors:errors
		})
	}
	else {
		var newUser = new User({
			name : name,
			email : email,
			username : username,
			passsword : password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login.');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;
    	if(!user){
    		return done(null, false, {message: 'Unknown User'});
    	}
    	User.comparePassword(password.toString(), user.password, function(err, isMatch){
    		if(err) throw err;
    		if(isMatch){
    			return done(null, false, {message: 'Invalid Password'});
    		}
    		else {
    			return done(null, user);
    			
    		}
    	});
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/users/home', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/users/home')
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', "You are logged out");

	res.redirect('/users/login')
})



module.exports = router;