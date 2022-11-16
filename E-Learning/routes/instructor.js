var express = require('express');
var router = express.Router();
var Instructor = require('../models/instructors');
var Classes = require('../models/classes');

//ส่งตัวแปร intructor กลับไปหน้า instructor/classes (ค้นหาข้อมูลตามตัวแปร req.user.username ที่ส่งไป)
router.get('/classes', function(req, res, next) {
    Instructor.getInstructorsByUserName(req.user.username,function(err,instructor){
        res.render('instructors/classes',{instructor:instructor});
    });
});

//นำค่า id ใน url แนบไปที่หน้า newlesson ผ่านตัวแปร class_id
router.get('/classes/:id/lesson/new', function(req, res, next) {
    res.render('instructors/newlesson',{class_id:req.params.id})
});


//แบบ Form ที่ส่งค่ามา 
router.post('/classes/:id/lesson/new', function(req, res, next) {
    info=[];
    info["class_id"] = req.params.id;
    info["lesson_number"] = req.body.lesson_number;
    info["lesson_title"] = req.body.lesson_title;
    info["lesson_body"] = req.body.lesson_body;

    Classes.addLesson(info,function(err,lesson){
        if(err) throw err;
    });
    res.redirect('/instructors/classes');
});


module.exports = router;
