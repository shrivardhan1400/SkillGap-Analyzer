const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : [true , "Email Already exist"],
        required : true,
    },
    password : {
        type : String,
        required : true,
        select : false,
    }
})

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel;