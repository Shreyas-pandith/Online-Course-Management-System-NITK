var express = require('express');
var router = express.Router();


//Database
var db = require('../db');


//Password Encryptoion
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


//Authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




router.get('/', function(req, res, next) {
    res.send(req.user);
});



router.get('/register', function(req, res, next) {
    res.render('register', { messages: ''});
});



router.post('/register', function(req, res, next) {


    req.checkBody('fname', 'Firsname field can not be empty').notEmpty();

    req.checkBody('psw', 'Password field can not be empty').notEmpty();
    req.checkBody('psw_repeat', 'Repeat Password field can not be empty').notEmpty();
    req.checkBody('psw_repeat', 'Repeat Password field must be equal to passwrd field').equals(req.body.psw);

    req.checkBody('email', 'Email field can not be empty').notEmpty();
    req.checkBody('email', 'Entered Email is not valid').isEmail();

    req.checkBody('lname', 'Lastname field can not be empty').notEmpty();


    console.log(req.body.role);

    const errors = req.validationErrors();

    if(errors){
        return res.render('register', { messages : errors})
    }
    else
    {
        var today = new Date();

        bcrypt.hash(req.body.psw, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            var userData = {
                'first_name': req.body.fname,
                'last_name': req.body.lname,
                'email': req.body.email,
                'password': hash,
                'created': today,
                'role': req.body.role
            };


            db.query(`INSERT INTO User SET ?`, userData, function(err, rows, fields) {
                if (!err) {

                    db.query(`SELECT LAST_INSERT_ID() as user_id`, function (error, results, fields) {

                        if(error){
                            console.log(error);
                        }

                        const user_id = results[0];
                        console.log(user_id);

                        return res.render('index', {message : ''});

                    });
                } else {
                    console.log(err);
                    return res.render('register', { messages : err})
                }
            });
        });


    }

});


router.get('/login', function(req, res, next) {

    res.render('login');
});


router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.


        db.query("SELECT * FROM User WHERE id = ? ",req.user ,function(err2,rows2){
            if(err2) {
                console.log(err2);
                res.redirect('/users/login')

            }
            else {
                var role = rows2[0].role;

                if (role === 'Student'){
                    res.redirect('/student/')
                }
                else if(role === 'Instructor'){
                    res.redirect('/instructor/')
                }
                else{
                    res.redirect('/users/')
                }
            }
        });



    });


router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});



router.get('/home', function(req, res, next) {

    if(!req.isAuthenticated())
    {
        return res.redirect('/users/login/')
    }


    db.query(`SELECT * FROM users WHERE id = ?`,[req.user.user_id], function (error, results, fields) {

        var user = {
            fname : results[0].first_name,
            lname : results[0].last_name,
            email : results[0].email
        };

        res.render('home', {user : user});

    });

});


passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});


passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});


function authenticationMiddleware() {
    return (req, res, next)  => {
        console.log(
            `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
        );

        if(req.isAuthenticated()) return next(

        );

        res.redirect('/users/login');
    }
}


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'psw',
        session: false,
        passReqToCallback : true
    },
    function(req,username, password, done) {

        db.query(`SELECT * FROM User WHERE email = ?`,[username], function (error, results, fields) {

            if(!error) {
                if (results.length === 0) {
                    console.log('No user');
                    return done(null, false);
                }

                bcrypt.compare(password, results[0].password.toString(), function (err, res) {
                    if(res === true){
                        console.log(results[0].id);
                        done(null, results[0].id);
                    }else {
                        console.log('wrong password');
                        done(null,false);
                    }
                });
            } else {
                console.log(error);
                return done(null, false);
            }



        });

    }
));

module.exports = router;