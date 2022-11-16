var express = require('express');
var app = express();
var fs = require ('fs'); //อ่านไฟล์ user.json 

//Get Method ดึงช้อมูลมาทั้งหมด
app.get('/getUsers',function (req,res) {
    fs.readFile(__dirname+ "/" + "user.json", "utf8" , function (err,data){
        console.log(data); //ก้อนข้อมูลของ user
        res.end(data);
    });
});

//Get Method ข้อมูลแบบมีเงื่อนไข
//users["user1"]
app.get('/getUsers/:id',function (req,res) {
    fs.readFile(__dirname+ "/" + "user.json", "utf8" , function (err,data){
        var users = JSON.parse(data); //Convert ข้อมูลให้เป็นก้อน
        var user = users["user" + req.params.id] //เพิ่มเงื่อนไข
        console.log(user); //ก้อนข้อมูลของ user
        res.end(JSON.stringify(user));
    });
});

app.delete('/delUser/:index',function (req,res) {
    fs.readFile(__dirname+ "/" + "user.json", "utf8" , function (err,data){
        data = JSON.parse(data); //Convert ข้อมูลให้เป็นก้อน
        delete data["user" + req.params.index] //เพิ่มเงื่อนไข
        res.end(JSON.stringify(data));
    });
});





var user = {
    "user3" : {
        "name" : "reputation",
        "password" : "1234",
        "occupation" : "buffalo",
        "id" : 3
    }
}

//เพิ่มข้อมูล user
app.post('/addUser',function (req,res) {
    fs.readFile( __dirname+ "/" + "user.json", "utf8" , function (err,data){
        data = JSON.parse(data); //Convert ข้อมูลให้เป็นก้อน
        data["user3"] = user["user3"]; //เพิ่มเงื่อนไข
        res.end(JSON.stringify(data));
    });
});




var server = app.listen(8081,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App Run At",host,port)
});

