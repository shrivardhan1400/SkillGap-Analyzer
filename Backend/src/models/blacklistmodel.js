const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true,
    }
})

module.exports.blacklistModel = new mongoose.model("blacklist" , blacklistSchema)