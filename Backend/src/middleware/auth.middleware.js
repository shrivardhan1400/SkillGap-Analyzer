const jwt = require('jsonwebtoken');
const {blacklistModel} = require('../models/blacklistmodel');
const UserModel = require('../models/user.models')

const userAuthMiddleware = async(req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token){
        return res.status(401).json({
            message : "Token is empty",
        })
    }
    try{
        const isBlackListToken = await blacklistModel.findOne({token})
        
        if(isBlackListToken){
            return res.status(401).json({
                Message : "Unauthorized User"
            })
        }
    
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        req.user = user;
        next();

    }catch(err){
        return res.status(401).json({
            message : "Invalid Token"
        })
    }
}

module.exports = userAuthMiddleware;