import {ERROR_CONSTANTS, INFO_CONSTANTS} from "../constants/index.js";
import {Auth, Validation} from "../utilities/index.js";
import bcrypt from "bcrypt";
import {User} from "../model/index.js";

const saltRounds = 10


class AuthService {
    async login(user) {
        const validation = user.email && user.password
        if (!validation)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)

        const foundUser = await Validation.isAuthenticated(user)
        if (!foundUser){
            throw new Error(ERROR_CONSTANTS.BAD_CREDENTIALS)
        }
        return foundUser
    }

    async register(user){
        const validation = user.fname && user.lname && user.email && user.password
        if (!validation)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)

        if (!await Validation.isValidUser(user))
            throw new Error(ERROR_CONSTANTS.REDUNDANT_EMAIL)

        try {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            return await User.create({...user, password: hashedPassword})
        }
        catch (e){
            throw new Error(ERROR_CONSTANTS.UNKNOWN_ERROR)
        }
    }
}

export {
    AuthService
}