var mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'student',
            database : 'DBMS'
        });

        db.connect(function(err){
            if(!err) {

                let createTodos1 = `CREATE TABLE if not exists USER ( 
                id INT NOT NULL AUTO_INCREMENT,  
                email varchar(100) COLLATE utf8_unicode_ci NOT NULL UNIQUE, 
                password varchar(255) COLLATE utf8_unicode_ci NOT NULL, 
                created datetime NOT NULL,
                role varchar(100),
                PRIMARY KEY(id)) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos1, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('User table created');
                });




                let createTodos2 = `CREATE TABLE if not exists DEPARTMENT
                (
                  Department_id INT NOT NULL AUTO_INCREMENT,
                  Department_Name VARCHAR(255) NOT NULL,
                  PRIMARY KEY (Department_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos2, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Department table created');
                });




                let createTodos3 = `CREATE TABLE if not exists STUDENT
                (
                  Student_id INT NOT NULL AUTO_INCREMENT,
                  First_Name VARCHAR(255),
                  Middle_Name VARCHAR(255),
                  Last_Name VARCHAR(255),
                  User_id INT NOT NULL,
                  Email VARCHAR(255),
                  Phone_Number NUMERIC(11),
                  Department_id INT,
                  PRIMARY KEY (Student_id),
                  FOREIGN KEY (Department_id) REFERENCES DEPARTMENT(Department_id),
                  FOREIGN KEY (User_id) REFERENCES USER(id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos3, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Student table created');
                });




                let createTodos4 = `CREATE TABLE if not exists INSTRUCTOR
                (
                  Instructor_id INT NOT NULL AUTO_INCREMENT,
                  User_id INT NOT NULL,
                  First_Name VARCHAR(255),
                  Last_Name VARCHAR(255),
                  Middle_Name VARCHAR(255),
                  Email VARCHAR(255),
                  Phone_Number NUMERIC(11),
                  Department_id INT,
                  PRIMARY KEY (Instructor_id),
                  FOREIGN KEY (Department_id) REFERENCES DEPARTMENT(Department_id),
                  FOREIGN KEY (User_id) REFERENCES USER(id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos4, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Instructor table created');
                });






                let createTodos5 = `CREATE TABLE if not exists COURSE
                (
                  Course_id INT NOT NULL AUTO_INCREMENT,
                  Course_Title VARCHAR(255) NOT NULL,
                  Course_Code VARCHAR(255) NOT NULL,
                  Instructor_id INT NOT NULL,
                  Department_id INT,
                  Introduction TEXT,
                  Description TEXT,
                  Requirements TEXT,
                  PRIMARY KEY (Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id),
                  FOREIGN KEY (Department_id) REFERENCES DEPARTMENT(Department_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos5, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Course table created');
                });




                let createTodos6 = `CREATE TABLE if not exists COURSE_MATERIALS
                (
                  Material_id INT NOT NULL AUTO_INCREMENT,
                  Name VARCHAR(255),
                  Remark VARCHAR(255),
                  Material TEXT,
                  Course_id INT NOT NULL,
                  Instructor_id INT NOT NULL,
                  PRIMARY KEY (Material_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos6, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Course Material table created');
                });






                let createTodos7 = `CREATE TABLE if not exists TESTS
                (
                  Test_id INT NOT NULL AUTO_INCREMENT,
                  Test_Name VARCHAR(100),
                  Maximun_Marks INT,
                  Question_Paper TEXT,
                  Answer_Key TEXT,
                  Course_id INT NOT NULL,
                  Instructor_id INT NOT NULL,
                  PRIMARY KEY (Test_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos7, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Tests table created');
                });





                let createTodos8 = `CREATE TABLE if not exists TEST_RESULTS
                (
                  Result_id INT NOT NULL AUTO_INCREMENT,
                  Marks_Obtained INT NOT NULL,
                  Test_id INT NOT NULL,
                  Student_id INT NOT NULL,
                  PRIMARY KEY (Result_id),
                  FOREIGN KEY (Test_id) REFERENCES TESTS(Test_id),
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos8, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Test_Results table created');
                });







                let createTodos9 = `CREATE TABLE if not exists GRADE
                (
                  Grade_id INT NOT NULL AUTO_INCREMENT,
                  Grade_Obtained CHAR(1) NOT NULL,
                  Final_Consolidated_Marks INT NOT NULL,
                  Student_id INT NOT NULL,
                  Course_id INT NOT NULL,
                  PRIMARY KEY (Grade_id),
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos9, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Grade table created');
                });






                let createTodos10 = `CREATE TABLE if not exists ANOUNCEMENT
                (
                  Anouncement_id INT NOT NULL AUTO_INCREMENT,
                  Short_Description VARCHAR(50),
                  Anouncement_Details VARCHAR(255),
                  Link1 VARCHAR(1000),
                  Link2 VARCHAR(1000),
                  Link3 VARCHAR(1000),
                  Posted_on DATETIME,
                  Course_id INT,
                  Instructor_id INT NOT NULL,
                  PRIMARY KEY (Anouncement_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos10, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Announcement table created');
                });







                let createTodos11 = `CREATE TABLE if not exists Q_A
                (
                  Q_A_id INT NOT NULL AUTO_INCREMENT,
                  Question VARCHAR(1000) NOT NULL,
                  Student_id INT,
                  Course_id INT NOT NULL,
                  PRIMARY KEY (Q_A_id),
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos11, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Q_A table created');
                });







                let createTodos12 = `CREATE TABLE if not exists ANSWER
                (
                  Answer_id INT NOT NULL AUTO_INCREMENT,
                  Answer VARCHAR(2500) NOT NULL,
                  Q_A_id INT NOT NULL,
                  Instructor_id INT,
                  Student_id INT,
                  PRIMARY KEY (Answer_id),
                  FOREIGN KEY (Q_A_id) REFERENCES Q_A(Q_A_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id),
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos12, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Answer table created');
                });







                let createTodos13 = `CREATE TABLE if not exists ENROLLED
                (
                  Course_id INT NOT NULL,
                  Student_id INT NOT NULL,
                  PRIMARY KEY (Course_id, Student_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos13, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Enrolled table created');
                });



                let createTodos14 = `CREATE TABLE if not exists ASSIGNMENT
                (
                  Assignment_id INT NOT NULL AUTO_INCREMENT,
                  Assignment_Name VARCHAR(100),
                  Maximun_Marks INT,
                  Assignment_File TEXT,
                  Solutions TEXT,
                  Course_id INT NOT NULL,
                  Instructor_id INT NOT NULL,
                  PRIMARY KEY (Assignment_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos14, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Assignment table created');
                });



                let createTodos15 = `CREATE TABLE if not exists SUBMISSION
                (
                  Submission_id INT NOT NULL AUTO_INCREMENT,
                  Submission_File TEXT,
                  Course_id INT NOT NULL,
                  Instructor_id INT NOT NULL,
                  Student_id INT NOT NULL,
                  PRIMARY KEY (Assignment_id),
                  FOREIGN KEY (Course_id) REFERENCES COURSE(Course_id),
                  FOREIGN KEY (Instructor_id) REFERENCES INSTRUCTOR(Instructor_id)
                  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
                ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos15, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Submission table created');
                });



                db.end(function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });

                console.log('Database is connected!');

            } else {
                console.log('Error connecting database.....!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();