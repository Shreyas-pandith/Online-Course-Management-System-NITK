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
  passport.authenticate('local-login', { successRedirect: '../instructor/',
                                   failureRedirect: '../',
                                   failureFlash: false,session:true})
);





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








router.get('/logout', function(req, res){
  if(req.user)
  {
  req.session.destroy(function (err) {
    res.redirect('../'); //Inside a callback… bulletproof!
  });
    }
});




router.get('/', function(req, res){
  if(req.user)
  {
  res.render('instructor/home',{user:req.user});
  }
  else{
    res.redirect('../');
  }
});

router.get('/profile', function(req, res, next) {
  // console.log("req",req.body);
  if(req.user)
  {
    
    connection.query("SELECT * FROM INSTRUCTOR WHERE Instructor_id = ? ",req.user.Instructor_id ,function(err,rows){
        if(err)
        {
          console.log("error");

        }
        else
        {
          res.render('instructor/profile',{'message':req.flash('loginMessage'),'user':rows[0]});
        }
    });


  }

});


router.get('/edit_profile', function(req, res){
  if(req.user)
  {
    connection.query("SELECT * FROM INSTRUCTOR WHERE Instructor_id = ? ",req.user.Instructor_id ,function(err,rows){
      if(err)
      {
        console.log("error");

      }
      else
      {
        res.render('instructor/edit_profile',{'user':rows[0]});
      }
  });
  
  }
  else
  {
    res.redirect('../');
  }
});



router.post('/edit_profile', function(req, res){
  if(req.user)
  {
        
        var user={
        
        "Email":req.body.Email,
      
        "First_Name" :req.body.FN,
        
        "Middle_Name":req.body.MN,
        "Last_Name": req.body.LN,
        
        "Phone_Number": req.body.Mobile
        
        
        }

      connection.query('UPDATE INSTRUCTOR SET ? where Instructor_id = ?',[user,req.user.Instructor_id], function (error, results, fields) {
      if(error)
      {

      }else
      {
          res.redirect('./profile');
      }
      });

  }
  else
      {
        res.redirect('../');
      }
});

router.get('/courses', function(req, res){
  if(req.user)
  {
    connection.query("SELECT * FROM COURSE WHERE Instructor_id = ? ",req.user.Instructor_id ,function(err,rows){
      if(err)
      {
        console.log("error");

      }
      else
      {
        res.render('instructor/courses',{'message':req.flash('loginMessage'),'courses':rows});
      }
  });
    

 
  }
});



router.get('/add_course', function(req, res){
  if(req.user)
  {

  res.render('instructor/create_course',{user:req.user});
  }
  else
  {
    res.redirect('../');
  }
});

router.post('/add_course', function(req, res){
        if(req.user)
        {
          var course={
              
            "Course_Title": req.body.title,
          
          "Instructor_id":  req.user.Instructor_id,
              "Department_id":1,
        
            
            };

          connection.query('INSERT INTO COURSE SET ? ',course, function (error, results, fields) {
          if(error)
          {
                    console.log(error)
          }else
          {
              res.redirect('./courses');
          }
          });

          
        }
        else
        {
          res.redirect('../');
        }
});


router.get('/course/(:id)', function(req, res){
  if(req.user)
  {
    connection.query("SELECT * FROM COURSE WHERE Course_id = ? ",req.params.id ,function(err,rows){
      if(err)
      {
        console.log("error");

      }
      else
      { 
        connection.query("SELECT * FROM DEPARTMENT WHERE Department_id = ? ",rows[0].Department_id ,function(err,result){
                       
          if(err)
          {
            console.log("error");
    
          }
          else
          {   
            connection.query("SELECT * FROM COURSE_MATERIALS WHERE Course_id = ? ",req.params.id,function(err,result1){

              if(err)
              {
                console.log("error");
        
              }
              else
              {
                res.render('instructor/course',{'message':req.flash('loginMessage'),'course':rows[0],'department':result[0],'materials':result1});
              }
            });
        
          }
        });
       
      }
  });
 
  }
  else{
    res.redirect('../');
  }
});




router.get('/course/(:id)/add_material', function(req, res){
  if(req.user)
  {
    res.render('instructor/add_material');
  }else
  {
    res.redirect('../');
  }
});


router.post('/course/(:id)/add_material', function(req, res){
  if(req.user)
  {
    var material={
       'Topic': req.body.Topic,
       'Remark':req.body.Remark ,
       'Material':req.body.Material,
       'Course_id': req.params.id,
       'Instructor_id':req.user.Instructor_id,

      
    };
    
    connection.query("INSERT INTO COURSE_MATERIALS SET  ? ",material ,function(err,result){
                       
      if(err)
      {
        console.log(err);

      }
      else
      {
       res.redirect('./');
      }
    });

  }else
  {
    res.redirect('../');
  }
});


module.exports = router;
