var express = require('express');
var router = express.Router();
var connection=require('../db');


router.get('/', function(req, res){

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('student/home',{'user':rows1[0], 'student': rows2[0]});
                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }

});





router.get('/profile', function(req, res, next) {
    if(req.user){
        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('student/profile',{'user':rows1[0], 'student': rows2[0]});
                    }
                });
            }
        });
    }
    else {
        res.redirect('/users/login/')
    }

});


router.post('/profile', function(req, res){
    if(req.user){


        req.checkBody('phone', 'Phone Number is Not Valid').isNumeric();


        console.log('dhhhdd');
        var First_Name = req.body.fname;
        var Middle_Name = req.body.mname;
        var Last_Name = req.body.lname;

        console.log('dhhhdd');
        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else if(rows1[0].role === 'Student') {
                connection.query("UPDATE STUDENT SET First_Name = ?, Middle_Name = ?, Last_Name = ? WHERE User_id = ?  ",[First_Name, Middle_Name, Last_Name,req.user] ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log('dhhhdd');
                        return res.redirect('/student/profile/')
                    }
                });
            }
        });
    }
    else {
        res.redirect('/login/')
    }
});


router.get('/courses', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('student/courses',{'user':rows1[0], 'student': rows2[0]});
                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }
});



router.get('/courses/course-details/', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('student/course',{'user':rows1[0], 'student': rows2[0]});
                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }
});


module.exports = router;
