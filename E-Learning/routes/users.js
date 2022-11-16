var express = require('express');
var router = express.Router();

//เป็นส่วนที่เป็น check validate ข้อมูล
var {check,validationResult} = require('express-validator');

var User = require('../models/users');
var Student = require('../models/students');
var Instructor = require('../models/instructors');


//ส่วนที่จำเป็นสำหรับการ Login
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('login');
  });
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});


router.post('/login',passport.authenticate('local',{
  failureRedirect:'/users/login',
  failureFlash:true 
}), 
function(req, res) {
  // req.flash("success", "ลงชื่อเข้าใช้เรียบร้อย");
  var usertype = req.user.type;
  res.redirect('/'+usertype+'s/classes');
});

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
      done(err,user);
  });
});

//รับ request จากแบบ Form Login
passport.use(new LocalStrategy(function(username,password, done) {
  User.getUserByUserName(username, function(err, user) {
      if(err) throw error
      if(!user){
        return done(null,false)
      }else{
        User.comparePassword(password,user.password,function(err, isMatch){
          if(err) throw error
            if(isMatch){
                return done(null,user)
            }
            else{
                return done(null,false)
            } 
        });
        return done(null,user)
      }
  });
}));

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('users/register');
});


//แบบ Form Register
router.post('/register',[
  check('email','กรุณาป้อนอีเมล').isEmail(),
  check('fname','กรุณาป้อนชื่อของท่าน').not().isEmpty(),
  check('lname','กรุณาป้อนนามสกุลของท่าน').not().isEmpty(),
  check('password','กรุณาป้อนรหัสผ่าน').not().isEmpty(),
  check('username','กรุณาป้อน Username').not().isEmpty()

], function(req, res, next) {

  const result = validationResult(req);

  var error = result.errors;
  //Validation Data (ถ้าไม่เป็นค่าว่าง) แสดง Error
  if(!result.isEmpty()){
    res.render('users/register', {errorkab:error})
    //ป้อนครบทุกส่วน บันทึกข้อมูล
  }else{
      var username = req.body.username;
      var type = req.body.type;
      var fname = req.body.fname;
      var lname = req.body.lname;
      var email = req.body.email;
      var password = req.body.password;

      var newUser = new User({
        username:username,
        email:email,
        password:password,
        type:type
      });
      //ถ้าเป็นนักเรียนมาทำส่วนนี้
      if(type=="student"){
        var newStudent = new Student({
            username:username,
            fname:fname,
            lname:lname,
            email:email,
        });
        //บันทึกพร้อมกัน 2 Table
        User.saveStudent(newUser,newStudent,function(err,user){
          if(err) throw err
        })
        //ถ้าเป็นจารย์มาทำส่วนนี้
      }else{
        var newInstructor = new Instructor({
          username:username,
          fname:fname,
          lname:lname,
          email:email,
        });
        //บันทึกพร้อมกัน 2 Table
        User.saveInstructor(newUser,newInstructor,function(err,user){
          if(err) throw err
        })
      }
      res.redirect('/');
  }
});

module.exports = router;
