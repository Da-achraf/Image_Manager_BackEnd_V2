import express from 'express'
import bcrypt from 'bcrypt'
import { ERROR_CONSTANTS, INFO_CONSTANTS } from '../constants/index.js'
import { Validation, Auth } from "../utilities/index.js";
import { User } from "../model/index.js"
import {AuthService} from "../services/index.js";

const authRouter = express.Router()
const authService = new AuthService()

authRouter.post('/register',  async (req, res) => {
    let user = req.body
    try {
        const createdUser = await authService.register(user)
        if (createdUser.id)
            res
                .status(200)
                .json({ status: 200 ,message: INFO_CONSTANTS.USER_REGISTERED, data: user.email})
    }
    catch (error){
        res
            .status(400)
            .json({ status: 400 ,message: ERROR_CONSTANTS.UNKNOWN_ERROR, data: null})
    }
})

authRouter.post('/login', async (req, res) => {
    let user = req.body
    try {
        const foundUser = await authService.login(user)
        const token = await Auth.generateToken(foundUser)
        res
            .status(200)
            .json({ status: 200 ,message: INFO_CONSTANTS.LOGIN_SUCCESS, data: { token, user: foundUser }})

    }
    catch (error){
        res
            .status(400)
            .json({ status: 400 ,message: error.message, data: null })
    }
})

export {
    authRouter
}