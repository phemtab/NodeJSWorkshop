var express = require('express');
var router = express.Router();
var Classes = require('../models/classes');
var Instructor = require('../models/instructors');


//เพิ่มหัวข้อใหญ่ของบทเรียนของอ.คนนั้น/คลาสทั้งหมดของอ.ทุกคน
router.post('/register',function(req,res,next){
    var class_id = req.body.class_id;
    var class_name = req.body.class_name;
    var description = req.body.description;
    var instructor = req.body.instructor;
    var img_url = req.body.img_url;

    var newClass = new Classes({
        class_id:class_id,
        title:class_name,
        description:description,
        instructor:instructor,
        img_url:img_url
    })

    //สร้าง Array
    info=[];
    info["instructor_user"]=req.user.username;
    info["class_id"]=class_id;
    info["class_title"]=class_name;

    //ลงทะเบียนคลาสทั้งหมดที่มี่สอนของอ.ทุกคน
    Classes.saveNewClass(newClass,function(err,student){
        if(err) throw err;
    });
    //ลงทะเบียนหัวข้อใหญ่ที่จะใช้สอนสำหรับ instructor ว่าคนนั้นสอนหัวข้อใหญ่อะไร
    Instructor.register(info,function(err,instructor){
        if(err) throw err;
    });
    
    res.redirect('/instructors/classes');
});


//แสดงรายละเอียดของหัวข้อใหญ่นั้นว่ามีหัวข้อย่อยอะไรบ้าง
router.get('/:id/lesson',function(req, res, next) {
    //className คือ callback เป็นก้อนข้อมูลที่ส่งมาทั้งก้อนของ class_id นั้นๆ
    Classes.getClassID([req.params.id],function(err,className){
        res.render('classes/viewlesson',{className:className})
    });
});


router.get('/:id/lesson/:lesson_id',function(req, res, next) {
    //ส่ง class_id ไปค้นใน db แล้วได้ก้อน object ออกมา
    Classes.getClassID([req.params.id],function(err,className){
        var lesson;
        //วนลูปเพื่อเช็คบทเรียนที่มีเลขตรงกัน (สมมตุิว่ามีบทเรียนย่อยเยอะจัด)
        for (var i = 0 ; i< className.lesson.length; i++){
            if(className.lesson[i].lesson_number == req.params.lesson_id){
                lesson = className.lesson[i];
            }
            
        }
        //ส่งก้อน className + Lesson เลขที่ไป
        res.render('classes/lesson',{className:className,lesson:lesson})
    });
});


module.exports = router;
