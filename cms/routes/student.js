var express = require('express');
var router = express.Router();
var connection=require('../db');


router.get('/', function(req, res){

    connection.query("SELECT * FROM User_Student WHERE user_id = ? ",req.user.id ,function(err,rows){
        if(err) {
            console.log(err);
            res.redirect('/users/login')

        }
        else {
            res.render('student/home',{'user':req.user, 'student': rows[0]});
        }
    });
});

router.get('/profile', function(req, res, next) {
    res.render('profile');
    // console.log("req",req.body);
    if(req.user.id)
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


router.post('/profile', function(req, res){
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


module.exports = router;
