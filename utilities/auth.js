import jwt from 'jsonwebtoken'
import {JWT_KEY} from "../config/index.js";
import {User} from "../model/index.js";

const generateToken = async (user) => {
    const foundUser = await User.findOne({ where: { email: user.email }})
    const tokenPayload = {
        userId: foundUser.id,
    }
    return jwt.sign(tokenPayload, JWT_KEY, { expiresIn: '4h' })
}


export {
    generateToken
}