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
                        connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id IN (SELECT Course_id FROM ENROLLED WHERE Student_id = ?) ORDER BY -Posted_on",rows2[0].Student_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/users/login')

                            }
                            else {
                                console.log(rows3);
                                res.render('student/home',{'user':rows1[0], 'student': rows2[0], 'announcement': rows3});
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
                                res.render('student/search/courses',{'user':rows1[0], 'student': rows2[0], courses : courses});
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




router.get('/course/:id/join', function(req, res, next) {

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


router.get('/courses', function(req, res){
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



router.get('/course-details/:id', function(req, res, next) {

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

                        connection.query(" SELECT * from ENROLLED WHERE Course_id= ? and Student_id= ? ",[req.params.id,student[0].Student_id],function(err3,enrolled){
                            if(err3) {

                                console.log(err1);
                                res.redirect('/student');
                            }
                            else {
                                if(enrolled.length === 0)
                                {
                                    res.redirect('/student/mycourses');
                                }else
                                {
                                    connection.query("select  * FROM COURSE where Course_id =?",req.params.id,function(err4,course){
                                        if(err4) {
                                            console.log(err4);
                                            res.redirect('/student');

                                        }
                                        else {

                                            connection.query("select  * FROM ANOUNCEMENT where Course_id =?",req.params.id,function(err5,announcements){
                                                if(err5) {
                                                    console.log(err5);
                                                    res.redirect('/student');

                                                }
                                                else {


                                                    res.render('student/mycourse',{'user':rows1[0], 'student': student,'course':course[0], 'announcements': announcements});
                                                }
                                            });

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


router.get('/course/join', function(req, res, next) {

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

                        connection.query(" SELECT * FROM COURSE WHERE Course_id NOT IN (SELECT Course_id FROM ENROLLED WHERE Student_id = ?) ",rows2[0].Student_id,function(err3,row3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/mycourses');
                            }
                            else {
                                console.log(row3);
                                res.render('student/search/courses',{'user':rows1[0], 'student': rows2[0], courses : row3});
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


router.get('/course/announcement/:id/:announcement_id', function(req, res, next) {

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

                        connection.query(" SELECT * from ENROLLED WHERE Course_id= ? and Student_id= ? ",[req.params.id,student[0].Student_id],function(err3,enrolled){
                            if(err3) {

                                console.log(err1);
                                res.redirect('/student');
                            }
                            else {
                                if(enrolled.length === 0)
                                {
                                    res.redirect('/student/mycourses');
                                }else
                                {
                                    connection.query("select  * FROM COURSE where Course_id =?",req.params.id,function(err4,course){
                                        if(err4) {
                                            console.log(err4);
                                            res.redirect('/student');

                                        }
                                        else {

                                            connection.query("select  * FROM ANOUNCEMENT where Course_id =?",req.params.id,function(err5,announcements){
                                                if(err5) {
                                                    console.log(err5);
                                                    res.redirect('/student');

                                                }
                                                else {

                                                    connection.query("select  * FROM ANOUNCEMENT where Anouncement_id =?",req.params.announcement_id,function(err5,announcement){
                                                        if(err5) {
                                                            console.log(err5);
                                                            res.redirect('/student');

                                                        }
                                                        else {


                                                            res.render('student/announcement',{'user':rows1[0], 'student': student,'course':course[0], 'announcements': announcements, 'announcement': announcement[0]});
                                                        }
                                                    });
                                                }
                                            });

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

router.get('/course/:course_id/resources/', function(req, res){
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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? ORDER BY -Posted_on",[req.params.course_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM COURSE_MATERIALS WHERE Course_id = ?",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/student/courses/')

                                            }
                                            else {
                                                console.log(rows5);
                                                res.render('student/resources',{'user':rows1[0], 'student': rows2[0], 'course': rows3[0], 'announcements': rows4, 'resources': rows5});
                                            }
                                        });
                                    }
                                });
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


router.get('/course/:course_id/resources/:resource_id', function (req, res) {

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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM COURSE_MATERIALS WHERE Material_id = ?",[req.params.resource_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {
                                        console.log(rows4[0].Material);
                                        res.sendFile(rows4[0].Material);

                                    }
                                });
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



router.get('/course/:course_id/assignments/', function(req, res){
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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? ORDER BY -Posted_on",[req.params.course_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM ASSIGNMENT WHERE Course_id = ?",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/student/courses/')

                                            }
                                            else {

                                                console.log(rows5);
                                                res.render('student/assignment',{'user':rows1[0], 'student': rows2[0], 'course': rows3[0], 'announcements': rows4, 'assignments': rows5});
                                            }
                                        });
                                    }
                                });
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


router.get('/course/:course_id/assignments/:assignment_id', function (req, res) {

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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ASSIGNMENT WHERE Assignment_id = ?",[req.params.assignment_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {
                                        console.log(rows4[0]);
                                        res.sendFile(rows4[0].Assignment_File);

                                    }
                                });
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


router.get('/course/:course_id/tests/', function(req, res){
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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? ORDER BY -Posted_on",[req.params.course_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM TESTS WHERE Course_id = ?",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/student/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM TEST_RESULTS WHERE Test_id IN (SELECT Test_id FROM TESTS WHERE Course_id = ?)",[req.params.course_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/student/courses/')

                                                    }
                                                    else {

                                                        console.log(rows6);
                                                        res.render('student/tests',{'user':rows1[0], 'student': rows2[0], 'course': rows3[0], 'announcements': rows4, 'tests': rows5, 'results': rows6});
                                                    }
                                                });

                                            }
                                        });
                                    }
                                });
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



router.get('/course/:course_id/tests/:test_id/question', function (req, res) {

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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {
                                        console.log(rows4[0].Question_Paper);
                                        res.sendFile(rows4[0].Question_Paper);

                                    }
                                });
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


router.get('/course/:course_id/tests/:test_id/answer', function (req, res) {

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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {
                                        console.log(rows4[0].Answer_Key);
                                        res.sendFile(rows4[0].Answer_Key);

                                    }
                                });
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



router.get('/course/:course_id/qa', function(req, res){
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
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? ",[req.params.course_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/student/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM Q_A WHERE Course_id = ? ORDER BY -Q_A_id",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/student/courses/')

                                            }
                                            else {


                                                connection.query("SELECT * FROM ANSWER WHERE Course_id = ? ORDER BY -Q_A_id",[req.params.course_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/student/courses/')

                                                    }
                                                    else {

                                                        console.log(rows6);
                                                        console.log(rows5);
                                                        res.render('student/qa',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'q': rows5, 'a':rows6});

                                                    }
                                                });





                                            }
                                        });



                                    }
                                });
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


router.post('/course/:course_id/qa', function(req, res){
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
                        var subject = req.body.subject;
                        var question = req.body.question;
                        var student = rows2[0].Student_id;
                        var name = rows2[0].First_Name + ' ' + rows2[0].Last_Name;
                        if(req.body.type){
                            student = null;
                            name = '';
                        }

                        var data = {
                            'Question': question,
                            'Subject': subject,
                            'Student_id': student,
                            'Instructor_id': null,
                            'Name': name,
                            'Course_id': req.params.course_id,
                        };

                        connection.query("INSERT INTO Q_A SET ?",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                console.log(rows3);
                                var url = '/student/course/' + req.params.course_id + '/qa';
                                res.redirect(url);

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




router.post('/course/:course_id/:question_id/', function(req, res){
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
                        var answer = req.body.answer;
                        var student = rows2[0].Student_id;
                        var name = rows2[0].First_Name + ' ' + rows2[0].Last_Name;
                        if(req.body.type){
                            student = null;
                            name = '';
                        }

                        var data = {
                            'Answer': answer,
                            'Q_A_id': req.params.question_id,
                            'Instructor_id': null,
                            'Student_id': student,
                            'Course_id': req.params.course_id,
                            'Name': name,
                        };

                        connection.query("INSERT INTO ANSWER SET ?",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/student/courses/')

                            }
                            else {

                                console.log(rows3);
                                var url = '/student/course/' + req.params.course_id + '/qa';
                                res.redirect(url);

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
