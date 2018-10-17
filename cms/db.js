var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     :  '3306',
    user     : 'root',
    password : 'dpsp1191',
    database : 'dbms'
  });
  
  connection.connect(function(err) {
      if (err) throw err
     
      console.log('You are now connected...');
    });
  
    module.exports = connection; 