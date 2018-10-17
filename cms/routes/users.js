var express = require('express');
var router = express.Router();
var connection=require('../db');


/* GET users listing. */
router.post('/signup', function(req, res, next) {
  // console.log("req",req.body);
  var today = new Date();
  var user={
   
    "mail":req.body.email,
    "password":req.body.password,
    
  }
  connection.query('INSERT INTO STU SET ?',user, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
  });
});

router.get('/signup', function(req, res, next) {
  console.log("not    not not  kdl");
  connection.query('SELECT * FROM us limit 2',function(err,rows,fields){
    res.render('users/all',{data: rows});
});

});
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM us',function(err,rows,fields){
    res.render('users/all',{data: rows});

});
});






module.exports = router;
