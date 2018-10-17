var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session=require('express-session');
var logger = require('morgan');

var passport = require('passport');
var mysql_store = require('express-mysql-session')(session);
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var instructorRouter=require('./routes/instructor');


var app = express();


// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(require('flash')());





db_connection=require('./db');
var sessionStore = new mysql_store({
  expiration: 60 * 2000
}, db_connection);


app.use(session({
  secret: "fd34s@!@dfa453f3DF#$D&W",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  

}));
app.use(passport.initialize());
app.use(passport.session());

  passport.serializeUser(function(user, done) {
  done(null, user.Instructor_id);
  });

 
  passport.deserializeUser(function(user, done) {
  db_connection.query("select Instructor_id from  INSTRUCTOR where Instructor_id  =  ?",user,function(err,rows){	
    done(err, rows[0]);
  });
  });
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instructor',instructorRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
