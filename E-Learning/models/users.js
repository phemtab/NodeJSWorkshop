var mongoose = require('mongoose');
var mongo = require('mongodb');
var db = mongoose.connection;
var bcrypt = require('bcryptjs');


//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/ElearningDB';

mongoose.connect(dbUrl,{
    useNewUrlParser:true
})

//ออกแบบ Schema
let UserSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    type:String
})
//สร้างโมเดล
var User = module.exports = mongoose.model('users',UserSchema);


//ส่วน Save ข้อมูลของนักเรียน
module.exports.saveStudent = function(newUser,newStudent,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password=hash;
            //เซฟ 2 ตารางพร้อมกันแต่อีกอันไม่ใช้ password
            newUser.save(callback);
            newStudent.save(callback);
        });
    });
}

//ส่วน Save ข้อมูลของผู้สอน
module.exports.saveInstructor = function(newUser,newInstructor,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password=hash;
            newUser.save(callback);
            newInstructor.save(callback);
        });
    });
}

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByUserName = function(username, callback){
    var query = {username:username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(password,hash,callback){
    bcrypt.compare(password,hash,function(err,isMatch){
        //ค่าที่ส่งกลับมาคือ isMatch
        callback(null,isMatch);
    });
}






