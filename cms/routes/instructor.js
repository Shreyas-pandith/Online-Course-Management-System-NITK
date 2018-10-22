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
}).single('file');


router.get('/', function(req, res){

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



module.exports = router;
