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



router.post('/search', function(req, res, next) {

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



                        connection.query(" SELECT * from (SELECT * FROM COURSE WHERE Course_Title like ?)A INNER JOIN INSTRUCTOR ON A.Instructor_id=INSTRUCTOR.Instructor_id",'%'+req.body.search+'%',function(err1,courses){
                            if(err1) {

                                console.log(err1);
                            }
                            else {
                                res.render('student/search/courses',{courses : courses});
                            }
                        });

                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }





});


router.get('/search/instructor/:id', function(req, res, next) {

    connection.query(" SELECT * from INSTRUCTOR WHERE Instructor_id= ? ",req.params.id,function(err1,row){
        if(err1) {

            console.log(err1);
        }
        else {
            res.render('search/instructor', { instructor: row[0] });
        }
    });

});

router.get('/search/course/:id', function(req, res, next) {

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



                        connection.query(" SELECT * from COURSE WHERE Course_id= ? ",req.params.id,function(err1,row){
                            if(err1) {

                                console.log(err1);
                            }
                            else {
                                res.render('student/search/course', { course: row[0] });
                            }
                        });


                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }








});




router.get('/search/course/:id/join', function(req, res, next) {

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

                        var enroll={
                            'Course_id' : req.params.id ,
                            'Student_id' : rows2[0].Student_id

                        };

                        connection.query(" INSERT INTO ENROLLED SET ? ",enroll,function(err1,row){
                            if(err1) {

                                console.log(err1);
                            }
                            else {
                                res.redirect('/student/mycourses');
                            }
                        });


                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }








});


router.get('/mycourses', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,student){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {

                        connection.query("select A.Course_id ,Course_Title,Course_Code from COURSE INNER JOIN (SELECT * FROM ENROLLED WHERE Student_id = ? )A ON COURSE.Course_id=A.Course_id ",student[0].Student_id ,function(err2,courses){
                            if(err2) {
                                console.log(err2);
                                res.redirect('/student');

                            }
                            else {


                                res.render('student/mycourses',{'user':rows1[0], 'student': student,'courses':courses});
                            }
                        });

                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }
});



router.get('/mycourses/:id', function(req, res, next) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM STUDENT WHERE User_id = ?  ",req.user ,function(err2,student){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {



                        connection.query(" SELECT * from ENROLLED WHERE Course_id= ? and Student_id= ? ",[req.params.id,student[0].Student_id],function(err1,enrolled){
                            if(err1) {

                                console.log(err1);
                                res.redirect('/student');
                            }
                            else {
                                if(enrolled.length ==0)
                                {
                                    res.redirect('/student/mycourses');
                                }else
                                {
                                    connection.query("select  * FROM COURSE where Course_id =?",req.params.id,function(err2,course){
                                        if(err2) {
                                            console.log(err2);
                                            res.redirect('/student');

                                        }
                                        else {


                                            res.render('student/mycourse',{'user':rows1[0], 'student': student,'course':course[0]});
                                        }
                                    });

                                }
                            }
                        });


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
