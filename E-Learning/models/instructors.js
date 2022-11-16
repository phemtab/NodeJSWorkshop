var mongoose = require('mongoose');


//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/ElearningDB';

mongoose.connect(dbUrl,{
    useNewUrlParser:true
})

//ออกแบบ Schema
let InstructorSchema = mongoose.Schema({
    username:String,
    fname:String,
    lname:String,
    email:String,
    classes:[{
        class_id:{
            type:String
        },
        class_title:{
            type:String
        }     
    }]
});
//สร้างโมเดล
var Instructor = module.exports = mongoose.model('instructors',InstructorSchema);

module.exports.getInstructorsByUserName = function(username,callback){
    var query = {
        username:username
    }
    Instructor.findOne(query,callback);
}


//ลงทะเบียนหัวข้อย่อยที่จะใช้สอนสำหรับ instructor
module.exports.register = function(info,callback){
    instructor_user = info["instructor_user"];
    class_id = info["class_id"];
    class_title = info["class_title"];
    var query  = {
        //ค่าที่ส่งมา = user ของ instructor นั้นๆ
        username : instructor_user
    }
    //ค้นหาข้อมูลที่มีอยู่แล้ว แล้วอัพเดทว่าจารย์คนนั้นจะสอนหัวข้อใหญ่อะไรบ้าง
    Instructor.findOneAndUpdate(
        query,{
            //จับคู่กับค่าที่ส่งมา
            $push:{
                "classes":{
                    class_id:class_id,
                    class_title:class_title
                }
            }
        },{
            safe:true,
            upsert:true 
        },callback)
}





