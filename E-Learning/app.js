var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var instructorRouter = require('./routes/instructor');
var ClassesRouter = require('./routes/classes');
var StudentRouter = require('./routes/students');


var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//ค่าตาม req.user (Default เป็น Null)
//ใช้ตอน Login (เป็น Global) กำหนดค่าเอาไปใช้ในหน้า View
app.get('*',function(req,res,next){
  res.locals.user = req.user|| null;
  next();
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instructors', instructorRouter);
app.use('/classes', ClassesRouter);
app.use('/students', StudentRouter);


// error handler (กำหนดให้รู้จักตัวแปรทั้งระบบ)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
