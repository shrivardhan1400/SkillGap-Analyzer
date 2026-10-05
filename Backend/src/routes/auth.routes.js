const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const UserControllers = require('../controllers/auth.controllers')
const userAuthMiddleware = require('../middleware/auth.middleware')

router.post('/register',
    [   
        body('email').isEmail().withMessage("InValid Email"),
        body('password').isLength({min : 8}).withMessage("Password Length is less than 8 characters"),
    ],
    UserControllers.RegisterUser
)
router.post('/login', 
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({min : 8}).withMessage('Password is atleast 8 characters')
    ],
    UserControllers.LoginUser
)

router.get('/logout', UserControllers.LogoutUser);

router.get('/get-user',userAuthMiddleware,UserControllers.getUser);
module.exports = router