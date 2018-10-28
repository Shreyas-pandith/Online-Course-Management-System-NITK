var express = require('express');
var router = express.Router();
var connection=require('../db');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
}).fields([{ name: 'question', maxCount: 1 }, { name: 'answer', maxCount: 1 }]);

var upload1 = multer({
    storage: storage,
}).single('file');

router.get('/', function(req, res){
    console.log('ashdgasgdhsad');
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('instructor/home',{'user':rows1[0], 'instructor': rows2[0]});
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
              connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                  if(err2) {
                      console.log(err2);
                      res.redirect('/users/login')

                  }
                  else {
                      console.log(rows1[0]);
                      res.render('instructor/profile',{'user':rows1[0], 'instructor': rows2[0]});
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


        console.log('ddd');
        var First_Name = req.body.fname;
        var Middle_Name = req.body.mname;
        var Last_Name = req.body.lname;


        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else if(rows1[0].role === 'Instructor') {
                connection.query("UPDATE INSTRUCTOR SET First_Name = ?, Middle_Name = ?, Last_Name = ? WHERE User_id = ?  ",[First_Name, Middle_Name, Last_Name,req.user] ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        return res.redirect('/instructor/profile/')
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
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Instructor_id = ?  ",rows2[0].Instructor_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err2);
                                res.redirect('/users/login')

                            }
                            else {

                                res.render('instructor/courses',{'user':rows1[0], 'instructor': rows2[0], 'courses': rows3});
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


router.get('/course-details/:id', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {
                                        console.log(rows4);
                                        res.render('instructor/course',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4});
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




router.post('/course-details/:id', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {

                        var data;

                        if(req.body.introduction){
                            data = {
                                'Introduction' : req.body.introduction
                            };
                        }
                        else if(req.body.description){
                            data = {
                                'Description' : req.body.description
                            };
                        }
                        else if(req.body.requirements){
                            data = {
                                'Requirements' : req.body.requirements
                            };
                        }

                        connection.query("UPDATE COURSE SET ?  WHERE Course_id = ?",[ data, req.params.id] ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {
                                console.log(rows3[0]);
                                url = '/instructor/course-details/' + req.params.id;
                                return res.redirect(url);
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




router.get('/offer-course', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('instructor/offer_course',{'user':rows1[0], 'instructor': rows2[0]});
                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }
});

router.post('/offer-course', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);


                        var data = {
                            'Course_Title': req.body.title,
                            'Course_Code': req.body.code,
                            'Instructor_id': rows2[0].Instructor_id
                        };

                        connection.query("INSERT INTO COURSE SET  ? ",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/offer-course')

                            }
                            else {

                                connection.query("SELECT LAST_INSERT_ID() as id" ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/offer-course')

                                    }
                                    else {
                                        console.log(rows4[0]);
                                        url = '/instructor/course-details/' + rows4[0].id;
                                        return res.redirect(url);
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


router.get('/course/announcement/:id1/:id2', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.id1 ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? AND Instructor_id = ? ORDER BY -Posted_on",[req.params.id1, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM ANOUNCEMENT WHERE Anouncement_id = ? ",req.params.id2 ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                console.log(rows4);
                                                res.render('instructor/announcement',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcement': rows5[0], 'announcements': rows4});
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



router.post('/course/announcement/:id', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {

                        var description = req.body.description;
                        var details = req.body.details;
                        var link1 = req.body.link1;
                        var link2 = req.body.link2;
                        var link3 = req.body.link3;

                        var data = {
                            'Short_Description': description,
                            'Anouncement_Details': details,
                            'Link1': link1,
                            'Link2': link2,
                            'Link3': link3,
                            'Course_id': req.params.id,
                            'Instructor_id':rows2[0].Instructor_id
                        };


                        connection.query("INSERT INTO ANOUNCEMENT SET ? , Posted_on = now()",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {
                                console.log(rows3[0]);
                                var url = '/instructor/course-details/' + req.params.id;
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


router.get('/course/:course_id/resources/', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM COURSE_MATERIALS WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {
                                                console.log(rows5);
                                                res.render('instructor/resources',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'resources': rows5});
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


router.post('/course/:course_id/resources/', function (req, res) {
    console.log('bbbnvnb');
    upload1(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        }

        // Everything went fine.
        if(req.user) {

            connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
                if(err1) {
                    console.log(err1);
                    res.redirect('/users/login')

                }
                else {
                    connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                        if(err2) {
                            console.log(err2);
                            res.redirect('/users/login')

                        }
                        else {

                            // Material_id INT NOT NULL AUTO_INCREMENT,
                            //     Topic VARCHAR(255),
                            //     Remark VARCHAR(255),
                            //     Material LONGBLOB,
                            //     Course_id INT NOT NULL,
                            //     Instructor_id INT NOT NULL,
                            console.log(req.file);
                            var data = {
                                'Name': req.body.resource_name,
                                'Material' : path.join(__dirname, "../public/uploads/" + req.file.filename),
                                'Course_id': req.params.course_id,
                                'Instructor_id': rows2[0].Instructor_id
                            };
                            console.log(data);
                            connection.query("INSERT INTO COURSE_MATERIALS SET ?",data ,function(err4,rows4){
                                if(err4) {
                                    console.log(err4);
                                    res.redirect('/instructor/courses/')

                                }
                                else {
                                    console.log(rows4);
                                    var url = '/instructor/course/' + req.params.course_id + '/resources/';
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
});

router.get('/course/:course_id/resources/:resource_id', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM COURSE_MATERIALS WHERE Material_id = ?",[req.params.resource_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

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

router.get('/course/:course_id/resources/:resource_id/delete', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM COURSE_MATERIALS WHERE Material_id = ?",[req.params.resource_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        fs.unlink(rows4[0].Material, (err5) => {
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {


                                                connection.query("DELETE FROM COURSE_MATERIALS WHERE Material_id = ?",[req.params.resource_id] ,function(err5,rows5){
                                                    if(err5) {
                                                        console.log(err5);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {
                                                        console.log('File was deleted');
                                                        var url = '/instructor/course/' + req.params.course_id + '/resources/';
                                                        res.redirect(url);

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



router.get('/course/:course_id/tests/', function(req, res){
    console.log('aasgshdggf');
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM TESTS WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM ASSIGNMENT WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {
                                                        console.log(rows6);
                                                        res.render('instructor/tests',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'tests': rows5, 'assignments': rows6});
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



router.get('/course/:course_id/tests/:test_id/edit', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM TESTS WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM TESTS WHERE Test_id",[req.params.test_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {
                                                        console.log(rows6);
                                                        res.render('instructor/test_edit',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'tests': rows5, 'test': rows6[0]});
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



router.post('/course/:course_id/tests/:test_id/edit', function (req, res) {
    console.log('bbbnvnb');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        }

        // Everything went fine.
        if(req.user) {

            connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
                if(err1) {
                    console.log(err1);
                    res.redirect('/users/login')

                }
                else {
                    connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                        if(err2) {
                            console.log(err2);
                            res.redirect('/users/login')

                        }
                        else {
                            connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                                if(err3) {
                                    console.log(err3);
                                    res.redirect('/instructor/courses/')

                                }
                                else {

                                    connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                        if(err4) {
                                            console.log(err4);
                                            res.redirect('/instructor/courses/')

                                        }
                                        else {

                                            connection.query("SELECT * FROM TESTS WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err5,rows5){
                                                if(err5) {
                                                    console.log(err5);
                                                    res.redirect('/instructor/courses/')

                                                }
                                                else {

                                                    connection.query("SELECT * FROM TESTS WHERE Test_id",[req.params.test_id] ,function(err6,rows6){
                                                        if(err6) {
                                                            console.log(err6);
                                                            res.redirect('/instructor/courses/')

                                                        }
                                                        else {
                                                            console.log(req.files['answer']);

                                                            var question = rows6[0].Question_Paper;
                                                            var answer = rows6[0].Answer_Key;
                                                            var date = rows6[0].Date;

                                                            if(req.files['question']){
                                                                 question = path.join(__dirname, "../public/uploads/" + req.files['question'][0].filename);
                                                            }


                                                            if(req.files['answer']){
                                                                 answer = path.join(__dirname, "../public/uploads/" + req.files['answer'][0].filename);
                                                            }

                                                            if(req.body.test_date){
                                                                date = req.body.test_date;
                                                            }


                                                            connection.query("UPDATE TESTS SET Test_Name = ?, Maximun_Marks = ?, Date = ?, Question_Paper = ?, Answer_Key = ?",[req.body.test_name, req.body.test_marks,date,question, answer] ,function(err7,rows7){
                                                                if(err7) {
                                                                    console.log(err7);
                                                                    res.redirect('/instructor/courses/')

                                                                }
                                                                else {
                                                                    console.log(req.files);
                                                                    var url = '/instructor/course/' + req.params.course_id + '/tests/';
                                                                    res.redirect(url);
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
            });
        }
        else{
            return res.redirect('/users/login')
        }
    });
});


router.post('/course/:course_id/tests/', function (req, res) {

        if(req.user) {

            connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
                if(err1) {
                    console.log(err1);
                    res.redirect('/users/login')

                }
                else {
                    connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                        if(err2) {
                            console.log(err2);
                            res.redirect('/users/login')

                        }
                        else {
                            let data = {
                                'Test_Name': req.body.test_name,
                                'Maximun_Marks':req.body.test_marks,
                                'Course_id': req.params.course_id,
                                'Instructor_id': rows2[0].Instructor_id,
                                'Date': req.params.test_date
                            };
                            console.log(data);
                            connection.query("INSERT INTO TESTS SET ?",data ,function(err4,rows4){
                                if(err4) {
                                    console.log(err4);
                                    res.redirect('/instructor/courses/')

                                }
                                else {
                                    console.log(rows4);
                                    var url = '/instructor/course/' + req.params.course_id + '/tests/';
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



router.get('/course/:course_id/tests/:test_id/question', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

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
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

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



router.get('/course/:course_id/tests/:test_id/delete', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        fs.unlink(rows4[0].Question_Paper, (err5) => {
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {


                                                fs.unlink(rows4[0].Answer_Key, (err5) => {
                                                    if(err5) {
                                                        console.log(err5);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {


                                                        connection.query("DELETE FROM TESTS WHERE Test_id = ?",[req.params.test_id] ,function(err5,rows5){
                                                            if(err5) {
                                                                console.log(err5);
                                                                res.redirect('/instructor/courses/')

                                                            }
                                                            else {
                                                                console.log('File was deleted');
                                                                var url = '/instructor/course/' + req.params.course_id + '/tests/';
                                                                res.redirect(url);

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
        });
    }
    else{
        return res.redirect('/users/login')
    }
});






router.get('/course/:course_id/tests/:test_id/results', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM TESTS WHERE Test_id = ? ",[req.params.test_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM STUDENT WHERE Student_id IN (SELECT Student_id FROM ENROLLED WHERE Course_id = ?) ORDER BY Student_id",[req.params.course_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {


                                                        connection.query("SELECT * FROM TEST_RESULTS WHERE Student_id IN (SELECT Student_id FROM ENROLLED WHERE Course_id = ?) ORDER BY Student_id",[req.params.course_id] ,function(err7,rows7){
                                                            if(err7) {
                                                                console.log(err7);
                                                                res.redirect('/instructor/courses/')

                                                            }
                                                            else {

                                                                console.log(rows7);
                                                                res.render('instructor/upload_result',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'students': rows6, 'test':rows5[0], 'results': rows7});

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
        });
    }
    else{
        return res.redirect('/users/login')
    }
});




router.post('/course/:course_id/tests/:test_id/results', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM TESTS WHERE Test_id = ? ",[req.params.test_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM STUDENT WHERE Student_id IN (SELECT Student_id FROM ENROLLED WHERE Course_id = ?) ORDER BY Student_id",[req.params.course_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {

                                                        let m = req.body.marks;

                                                        for(let i=0;i<rows6.length;i++)
                                                        {console.log('aasgshdggf');
                                                            let data = {
                                                                'Marks_Obtained':m[i],
                                                                'Test_id':req.params.test_id,
                                                                'Student_id': rows6[i].Student_id
                                                            };

                                                            connection.query("SELECT * FROM TEST_RESULTS WHERE Test_id = ? AND Student_id = ?",[req.params.test_id,rows6[i].Student_id] ,function(err7,rows7){
                                                                if(err7) {
                                                                    console.log(err5);
                                                                    res.redirect('/instructor/courses/')

                                                                }
                                                                else {
                                                                    if(rows7.length === 0){
                                                                        connection.query("INSERT INTO TEST_RESULTS SET ? ",data ,function(err8,rows8){
                                                                            if(err8) {
                                                                                console.log(err8);
                                                                                res.redirect('/instructor/courses/')

                                                                            }
                                                                        });
                                                                    }
                                                                    else {

                                                                        connection.query("UPDATE TEST_RESULTS SET Marks_Obtained = ? WHERE Test_id = ? AND Student_id = ? ",[m[i],req.params.test_id,rows6[i].Student_id] ,function(err8,rows8){
                                                                            if(err8) {
                                                                                console.log(err8);
                                                                                res.redirect('/instructor/courses/')

                                                                            }
                                                                        });

                                                                    }
                                                                }
                                                            });



                                                        }

                                                        console.log(rows6);
                                                        var url = '/instructor/course/' + req.params.course_id+ '/tests/';
                                                        res.redirect(url);

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



router.get('/course/:course_id/assignments/', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM ASSIGNMENT WHERE Course_id = ? AND Instructor_id = ?",[req.params.course_id, rows2[0].Instructor_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                console.log(rows5);
                                                res.render('instructor/assignment',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'assignments': rows5});
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



router.post('/course/:course_id/assignments/', function (req, res) {
    console.log('bbbnvnb');
    upload1(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            return res.redirect('/instructor/')
        }

        // Everything went fine.
        if(req.user) {

            connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
                if(err1) {
                    console.log(err1);
                    res.redirect('/users/login')

                }
                else {
                    connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                        if(err2) {
                            console.log(err2);
                            res.redirect('/users/login')

                        }
                        else {

                            // Material_id INT NOT NULL AUTO_INCREMENT,
                            //     Topic VARCHAR(255),
                            //     Remark VARCHAR(255),
                            //     Material LONGBLOB,
                            //     Course_id INT NOT NULL,
                            //     Instructor_id INT NOT NULL,
                            console.log(req.file);
                            var data = {
                                'Assignment_Name': req.body.resource_name,
                                'Assignment_file' : path.join(__dirname, "../public/uploads/" + req.file.filename),
                                'Course_id': req.params.course_id,
                                'Instructor_id': rows2[0].Instructor_id
                            };
                            console.log(data);
                            connection.query("INSERT INTO ASSIGNMENT SET ?",data ,function(err4,rows4){
                                if(err4) {
                                    console.log(err4);
                                    res.redirect('/instructor/courses/')

                                }
                                else {
                                    console.log(rows4);
                                    var url = '/instructor/course/' + req.params.course_id + '/assignments/';
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
});



router.get('/course/:course_id/assignments/:assignment_id', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ASSIGNMENT WHERE Assignment_id = ?",[req.params.assignment_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

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


router.get('/course/:course_id/assignments/:assignment_id/delete', function (req, res) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ASSIGNMENT WHERE Assignment_id = ?",[req.params.assignment_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        fs.unlink(rows4[0].Assignment_File, (err5) => {
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {


                                                connection.query("DELETE FROM ASSIGNMENT WHERE Assignment_id = ?",[req.params.assignment_id] ,function(err5,rows5){
                                                    if(err5) {
                                                        console.log(err5);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {
                                                        console.log('File was deleted');
                                                        var url = '/instructor/course/' + req.params.course_id + '/assignments/';
                                                        res.redirect(url);

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






router.get('/course/:course_id/assignment/:assignment_id/submissions', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM SUBMISSION, STUDENT WHERE Assignment_id = ? AND SUBMISSION.Student_id = STUDENT.Student_id",[req.params.assignment_id] ,function(err4,rows5){
                                            if(err4) {
                                                console.log(err4);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                console.log(rows5);
                                                res.render('instructor/submissions',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'submissions': rows5});

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



router.get('/course/:course_id/students', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM STUDENT WHERE Student_id IN (SELECT Student_id FROM ENROLLED WHERE Course_id = ?)",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err4);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                console.log(rows5);
                                                res.render('instructor/students',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'students': rows5});

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






router.get('/course/:course_id/qa', function(req, res){
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ?  AND Instructor_id = ? ORDER BY -Posted_on",[req.params.course_id, rows2[0].Instructor_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM Q_A WHERE Course_id = ? ORDER BY -Q_A_id",[req.params.course_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {


                                                connection.query("SELECT * FROM ANSWER WHERE Course_id = ? ORDER BY -Q_A_id",[req.params.course_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {

                                                        console.log(rows6);
                                                        console.log(rows5);
                                                        res.render('instructor/qa',{'user':rows1[0], 'instructor': rows2[0], 'course': rows3[0], 'announcements': rows4, 'q': rows5, 'a':rows6});

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
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        var subject = req.body.subject;
                        var question = req.body.question;
                        var instructor = rows2[0].Instructor_id;
                        var name = rows2[0].First_Name + ' ' + rows2[0].Last_Name;
                        if(req.body.type){
                            instructor = null;
                            name = '';
                        }

                        var data = {
                            'Question': question,
                            'Subject': subject,
                            'Student_id': null,
                            'Instructor_id': instructor,
                            'Name': name,
                            'Course_id': req.params.course_id,
                        };

                        connection.query("INSERT INTO Q_A SET ?",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                console.log(rows3);
                                var url = '/instructor/course/' + req.params.course_id + '/qa';
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
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        var answer = req.body.answer;
                        var instructor = rows2[0].Instructor_id;
                        var name = rows2[0].First_Name + ' ' + rows2[0].Last_Name;
                        if(req.body.type){
                            instructor = null;
                            name = '';
                        }

                        var data = {
                            'Answer': answer,
                            'Q_A_id': req.params.question_id,
                            'Instructor_id': instructor,
                            'Student_id': null,
                            'Course_id': req.params.course_id,
                            'Name': name,
                        };

                        connection.query("INSERT INTO ANSWER SET ?",data ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                console.log(rows3);
                                var url = '/instructor/course/' + req.params.course_id + '/qa';
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


router.get('/course/:course_id/assignment/:submission_id/submission', function (req, res) {
    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM INSTRUCTOR WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        connection.query("SELECT * FROM COURSE WHERE Course_id = ?  ",req.params.course_id ,function(err3,rows3){
                            if(err3) {
                                console.log(err3);
                                res.redirect('/instructor/courses/')

                            }
                            else {

                                connection.query("SELECT * FROM ANOUNCEMENT WHERE Course_id = ? ORDER BY -Posted_on",[req.params.course_id] ,function(err4,rows4){
                                    if(err4) {
                                        console.log(err4);
                                        res.redirect('/instructor/courses/')

                                    }
                                    else {

                                        connection.query("SELECT * FROM ASSIGNMENT WHERE Assignment_id = ?",[req.params.assignment_id] ,function(err5,rows5){
                                            if(err5) {
                                                console.log(err5);
                                                res.redirect('/instructor/courses/')

                                            }
                                            else {

                                                connection.query("SELECT * FROM SUBMISSION WHERE Submission_id = ?",[req.params.submission_id] ,function(err6,rows6){
                                                    if(err6) {
                                                        console.log(err6);
                                                        res.redirect('/instructor/courses/')

                                                    }
                                                    else {

                                                        console.log(rows6);
                                                        res.sendFile(rows6[0].Submission_File);
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




module.exports = router;
