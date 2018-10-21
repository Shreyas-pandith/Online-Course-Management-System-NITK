var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' ,message: req.flash('loginMessage')});
});

router.get('/course', function(req, res, next) {
    res.render('course', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});

router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Express' });
});

router.get('/services', function(req, res, next) {
    res.render('services', { title: 'Express' });
});

module.exports = router;
