const { default: mongoose } = require("mongoose");
var bcrypt = require('bcryptjs');

//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/LoginDB';

mongoose.connect(dbUrl,{
    useNewUrlParser:true
})


//ออกแบบ Schema
let userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})
//สร้างโมเดล
var User = module.exports = mongoose.model('User',userSchema);


//ออกแบบฟังก์ชันสำหรับบันทึกข้อมูล
//model คือข้อมูลที่โยนมา
module.exports.createUser = function(model,data){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(model.password, salt, function(err, hash) {
                model.password=hash;
                model.save(data);
        });
    });
}

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByName = function(name, callback){
    var query = {name:name};
    User.findOne(query, callback);
}


module.exports.comparePassword = function(password,hash, callback){
    bcrypt.compare(password,hash,function(err,isMatch){
        callback(null,isMatch);
    });
}


