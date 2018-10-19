var mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection({
            host : 'localhost',
            user : 'root',
            password : '',
            database :'DBMS'
        });

        db.connect(function(err){
            if(!err) {

                let createTodos1 = `CREATE TABLE if not exists User ( 
                id int(11) NOT NULL AUTO_INCREMENT, 
                first_name varchar(100) COLLATE utf8_unicode_ci NOT NULL, 
                last_name varchar(100) COLLATE utf8_unicode_ci NOT NULL, 
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
                    console.log('User tabl created');
                });

                let createTodos2 = `CREATE TABLE if not exists User_Instructor ( 
                id int(11) NOT NULL AUTO_INCREMENT, 
                user_id int(11), 
                PRIMARY KEY(id),
                FOREIGN KEY (user_id) REFERENCES User(id))
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos2, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('User_Instructor tabl created');
                });


                let createTodos3 = `CREATE TABLE if not exists User_Student ( 
                id int(11) NOT NULL AUTO_INCREMENT, 
                PRIMARY KEY(id) ,
                user_id int(11), 
                FOREIGN KEY (user_id) REFERENCES User(id))
                ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`;

                db.query(createTodos3, function(err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('User_Student tabl created');
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