var express = require('express');
var router = express.Router();
var connection=require('../db');
var passport=require('passport');
var LocalStrategy   = require('passport-local').Strategy;



passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  
},
function(req, email, password, done) { // callback with email and password from our form
   
  console.log("email",email);
  console.log("password",password);
   connection.query("SELECT * FROM INSTRUCTOR WHERE Email = ? ", email ,function(err,rows){
               if (err)
                return done(err);
        
                if (rows.length==0) {

                  console.log("sorry no user found");
              //    return done(null, false)
                
             return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                     } 

          // if the user is found but the password is wrong
                if (!( rows[0].password == password))
                  {console.log("sorry");
                 // return done(null, false);
                  return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                  }
                // all is well, return successful user
                console.log("success");
                req.flash('loginMessage', 'Successfully loggedin.');
                return done(null, rows[0]);			

          });


}));





router.post('/login',
  passport.authenticate('local-login', { successRedirect: '../instructor/profile',
                                   failureRedirect: '../',
                                   failureFlash: false,session:true})
);


router.get('/profile', function(req, res, next) {
    // console.log("req",req.body);
 res.render('instructor/profile',{'message':req.flash('loginMessage'),'user':req.user});

});



router.post('/signup', function(req, res, next) {
  // console.log("req",req.body);
  var today = new Date();
  console.log("req",req.body);
  var user={
   
    "Email":req.body.email,
    "password":req.body.password,
    
  }

  connection.query('INSERT INTO INSTRUCTOR SET ?',user, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    req.flash("loginMessage"," something went wrong ..Try again");
   
    res.redirect('../');
  }else{
    console.log('The solution is: ', results);
    req.flash("loginMessage"," successfully registered NOW LOGIN");
    
    res.redirect('../');
  }
  });
});



router.get('/', function(req, res, next) {
  console.log("   oh oh");
  
 
  
    if(req.user)
    {
        res.redirect('/profile');
    }
    else
    res.redirect('../');
    console.log(req.user);
    
  
});




router.get('/logout', function(req, res){
  req.session.destroy(function (err) {
    res.redirect('../users'); //Inside a callback… bulletproof!
  });
});

module.exports = router;
