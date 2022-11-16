var mongoose = require('mongoose');
var mongo = require('mongodb');
var db = mongoose.connection;

//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/ElearningDB';

mongoose.connect(dbUrl,{
    useNewUrlParser:true
})

//ออกแบบ Schema
let ClassesSchema = mongoose.Schema({
    class_id:String,
    title:String,
    description:String,
    img_url:String,
    instructor:String,
    lesson:[{
        lesson_number:{type:Number},
        lesson_title:{type:String},
        lesson_body:{type:String}
    }]
})
//สร้างโมเดล
var Classes = module.exports = mongoose.model('ElearningDB',ClassesSchema);

//
module.exports.getClasses=function(callback,limit){
    Classes.find(callback).limit(limit)
}


//ส่งค่า class_id เข้ามา
module.exports.getClassID=function(class_id,callback){
    var query ={
        //class_id เท่ากับค่า id ที่กดปุ่มคลาสนั้นที่อยากให้แสดงรายละเอียด
        class_id : class_id
    }
    //ค้นหา class_id ที่ตรงแล้วส่งค่า callback กลับไป
    Classes.findOne(query,callback);
}

module.exports.saveNewClass=function(newClass,callback){
   newClass.save(callback);
}



//เพิ่มเนื้อหาย่อยๆของบทเรียนนั้นๆ
module.exports.addLesson = function(info,callback){
    
    lesson_number = info["lesson_number"];
    lesson_title = info["lesson_title"];
    lesson_body = info["lesson_body"];
    class_id = info["class_id"];

    var query  = {
        //ค่าในตาราง = ค่าที่ส่งมา
        class_id : class_id
    }
   
    //ค้นหาข้อมูลที่มีอยู้แล้วในฐานข้อมูลจาก class_id แล้ว update
    Classes.findOneAndUpdate(
        query,{
            //จับคู่กับค่าที่ส่งมา
            $push:{
                "lesson":{
                    lesson_number: lesson_number,
                    lesson_title: lesson_title,
                    lesson_body: lesson_body
                }
            }
        },{
            safe:true,
            upsert:true 
        },callback)
}




