var express = require('express');
var router = express.Router();
const Classes = require('../models/classes');
const User = require('../models/users');
const Student = require('../models/students');
const Instructor = require('../models/instructors');



router.get('/', function(req, res, next) {
  //ค่าที่ส่งกลับมาคือ Classes
  Classes.getClasses(function(err,classes){
      res.render('index', { classes: classes });
  })
});

router.get('/',enSureAuthenticated,function(req, res, next) {
  res.render('index')
});

function enSureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/users/login');
  }
}

module.exports = router;
