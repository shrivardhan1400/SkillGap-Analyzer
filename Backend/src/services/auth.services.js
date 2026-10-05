const UserModel = require('../models/user.models')
const bcrypt = require('bcrypt')

const createUser = async ({
    email,password
}) => {
    if(!email || !password){
        throw new Error("All fields are Required")
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await UserModel.create({
        email,
        password : hashedPassword
    })
    return user;
}
module.exports = createUser;
