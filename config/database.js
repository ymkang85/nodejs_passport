const mongoose = require("mongoose");

//DB 접속
mongoose.connect('mongodb://127.0.0.1:27017/passport')
.then(()=>{
    console.log("몽고디비 연결 성공");
}).catch((err)=>{
    console.error("몽고디비 연결 에러", err);
});

const userSchema = mongoose.Schema({
    username: String,
    userpass: String
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;