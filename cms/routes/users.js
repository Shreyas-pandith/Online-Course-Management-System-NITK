var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("*");

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

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




router.get('/', csrfProtection,  function(req, res, next) {
    res.send(req.user);
});



router.get('/register', csrfProtection,  function(req, res, next) {
    res.render('register', { csrfToken: req.csrfToken() ,  messages: req.flash('info')});
});



router.post('/register', function(req, res, next) {

    req.checkBody('psw', 'Password field can not be empty').notEmpty();
    req.checkBody('psw_repeat', 'Repeat Password field can not be empty').notEmpty();
    req.checkBody('psw_repeat', 'Repeat Password field must be equal to passwrd field').equals(req.body.psw);

    req.checkBody('email', 'Email field can not be empty').notEmpty();
    req.checkBody('email', 'Entered Email is not valid').isEmail();


    console.log(req.body.role);

    const errors = req.validationErrors();

    if(errors){
        console.log(errors);
        for(var i=0;i<errors.length;i++){
            req.flash('info', errors[i].msg);
        }
        return res.redirect('/users/register/')
    }
    else
    {
        var today = new Date();

        bcrypt.hash(req.body.psw, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            var userData = {
                'email': req.body.email,
                'password': hash,
                'created': today,
                'role': req.body.role
            };


            db.query(`INSERT INTO USER SET ?`, userData, function(err, rows, fields) {
                if (!err) {

                    db.query(`SELECT LAST_INSERT_ID() as user_id`, function (error, results, fields) {

                        if(error){
                            console.log(error);
                        }

                        console.log(results[0].user_id);

                        var user_id = results[0].user_id;

                        var role = req.body.role;

                        var sql = '';

                        var data;

                        if(role === 'Student'){
                            sql = "INSERT INTO STUDENT SET ?";
                            data = {
                                'User_id' : user_id,
                                'Roll_Number' : 'ROLLNO' + 10000 + user_id
                            };
                        }
                        else {
                            sql = "INSERT INTO INSTRUCTOR SET ?";
                            data = {
                                'User_id' : user_id
                            };
                        }


                        db.query(sql, data, function(err2,rows2){
                            if(err2) {
                                console.log(err2);

                                db.query("DELETE FROM USER WHERE id = ?", user_id, function(err3,rows2){
                                    if(err3) {
                                        console.log(err3);
                                        res.redirect('/users/register')
                                    }
                                    else {
                                        res.redirect('/users/register')
                                    }
                                });

                            }
                            else {

                                //return res.redirect('/users/login/');
                                req.flash('Successfully Registered.Please Login');
                                //next();
                                return res.render('login')

                            }
                        });

                    });
                } else {
                    req.flash('info','Email Already Exists');
                    console.log(err);
                    return res.redirect('/users/register/')
                }
            });
        });


    }

});



router.get('/login',  csrfProtection, function(req, res, next) {
    res.render('login',{ csrfToken: req.csrfToken() ,  messages: req.flash('info')});
});


router.post('/forgot_password', function(req, res, next) {


    var email = req.body.email;

    db.query("SELECT * FROM USER WHERE email = ?",email ,function(err2,rows2){
        if(err2) {
            console.log(err2);
            es.redirect('/users/login/')

        }
        else {
            if(rows2.length===0)
            {
                res.redirect('/users/login/')
            }
            else
            {
                var data = {
                    'User_id':rows2[0].id,
                    'Secret': Math.floor(Math.random() * 1000000) + '_' + rows2[0].id
                };
                db.query("INSERT INTO PASSWORD SET ?",data ,function(err2,rows3){
                    if(err2) {
                        console.log(err2);
                        es.redirect('/users/login/')

                    }
                    else {
                        var url = 'http://localhost:3000/users/forgot_password/' + data.Secret;
                        const msg = {
                            to: rows2[0].email,
                            from: 'siddeshlc1998@gmail.com',
                            subject: 'Reset Your Password' + ' '+ rows2[0].email,
                            text: 'Do not Share with Anyone',
                            html: '<h3>Please Copy Paste the url To Reset Your Password</h3><br>' +
                                'http://localhost:3000/users/forgot_password/' + data.Secret,
                        };

                        var f = sgMail.send(msg);
                        if(f)
                            console.log(f);
                        console.log(msg);
                        res.redirect('/users/login/')
                    }
                });
            }
        }
    });

});




router.get('/forgot_password/:id/',  csrfProtection, function(req, res, next) {


    var e = req.body.email;

    db.query("SELECT * FROM PASSWORD WHERE Secret = ?",req.params.id ,function(err2,rows2){
        if(err2) {
            console.log(err2);
            res.redirect('/users/login/')

        }
        else {
            if(rows2.length===0)
            {
                res.redirect('/users/login/')
            }
            else
            {
                res.render('reset',{ csrfToken: req.csrfToken() ,  messages: req.flash('info'), 'id':req.params.id});
            }
        }
    });

});


router.post('/forgot_password/:id/',  csrfProtection, function(req, res, next) {


    var e = req.body.email;

    db.query("SELECT * FROM PASSWORD WHERE Secret = ?",req.params.id ,function(err2,rows2){
        if(err2) {
            console.log(err2);
            res.redirect('/')

        }
        else {
            if(rows2.length===0)
            {
                console.log('dsd');
                res.redirect('/')
            }
            else
            {
                console.log(rows2);
                bcrypt.hash(req.body.psw, saltRounds, function(err, hash) {
                    // Store hash in your password DB.


                    db.query(`UPDATE USER SET password = ? WHERE id = ?`, [hash, rows2[0].User_id], function(err, rows, fields) {
                        if (!err) {
                            db.query(`DELETE FROM PASSWORD WHERE User_id = ?`, [ rows2[0].User_id], function(err, rows, fields) {
                                if (!err) {
                                    console.log(err);
                                    return res.redirect('/users/login/')

                                } else {
                                    return res.redirect('/')
                                }
                            });

                        } else {
                            console.log(err);
                            return res.redirect('/')
                        }
                    });
                });
            }
        }
    });

});



router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.


        db.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err2,rows2){
            if(err2) {
                req.flash('User Does not Exists');
                return res.render('login', { csrfToken: req.csrfToken() })

            }
            else {
                var role = rows2[0].role;

                if (role === 'Student'){
                    res.redirect('/student/')
                }
                else if(role === 'Instructor'){
                    req.flash('info', 'Succesfully Logged In.');
                    res.redirect('/instructor/')
                }
                else{
                    req.flash('User Does not Exists');
                    res.redirect('/users/login/');
                }
            }
        });



    });



router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
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

        db.query(`SELECT * FROM USER WHERE email = ?`,[username], function (error, results, fields) {

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
