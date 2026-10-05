const UserModel = require('../models/user.models')
const createUser = require('../services/auth.services')
const jwt = require('jsonwebtoken')
const {validationResult, cookie} = require('express-validator')
const bcrypt = require('bcrypt');
const { blacklistModel } = require('../models/blacklistmodel');
/**
 * 
 * @Route POST /api/auth/register req 
 * @Description {user} res 
 * @access Public next 
 */
module.exports.RegisterUser =  async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            error
        })
    }
    const {username,email,password} = req.body;

    const UserAlreadyExist = await UserModel.findOne({
        $or : [ {username} , {email}]
    })

    if(UserAlreadyExist){
        return res.status(400).json({
            message : "Username or email Already exist"
        })
    }
    const user = await createUser({email,password});
    
    const token = await jwt.sign(
        {id : user._id},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    return  res.status(200).json({
        user
    })
}

/**
 * 
 * @Route Post /api/auth/login req 
 * @description user, token res 
 * @access Public
 */

module.exports.LoginUser = async (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            error
        })
    }

    const {email,password} = req.body;
    const user = await UserModel.findOne({email}).select('+password');
    
    if(!user){
        return res.status(404).json({
            "message" : "User Not Found"
        })
    }

    const isMatch  = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({
            "message" : "Password is inCorrect"
        })
    }

    const token = await jwt.sign(
        {id : user._id},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        user
    });
}

module.exports.LogoutUser = async (req,res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(400).json({
            "message" : "Invalid cookie"
        })
    }
    await blacklistModel.create({token});

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax"
    });

    return res.status(200).json({
        "message" : "Logout Successfully"
    })
}

module.exports.getUser = async(req,res) => {

    const user = req.user;
    return res.status(200).json({
        user 
    })
}




