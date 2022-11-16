var mongoose = require('mongoose');
var mongo = require('mongodb');
var db = mongoose.connection;

//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/ElearningDB';

mongoose.connect(dbUrl,{
    useNewUrlParser:true
})

//ออกแบบ Schema
let StudentSchema = mongoose.Schema({
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
})
//สร้างโมเดล
var Student = module.exports = mongoose.model('students',StudentSchema);

module.exports.getStudentsByUserName = function(username,callback){
    var query = {
        username:username
    }
    Student.findOne(query,callback);
}

module.exports.register = function(info,callback){
    student_user = info["student_user"];
    class_id = info["class_id"];
    class_title = info["class_title"];
    
    var query  = {
        username : student_user
    }
    Student.findOneAndUpdate(
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





