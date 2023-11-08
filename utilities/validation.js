import {User} from '../model/index.js'
import bcrypt from "bcrypt";

const isValidObject = (obj) => {
    if (Object.keys(obj).length === 0) return false
    for (let key in obj){
        if (obj.hasOwnProperty(key) && obj[key] === null) return false;
    }
    return true
}

const isValidUser = async (user) => {
    return !await User.findOne({ where: { email: user.email }})
}

const isAuthenticated = async (user) => {
    const foundUser = await User.findOne({ where: { email: user.email }})
    if (!foundUser){
        console.log('Step 10..')
        return false
    }
    if (await bcrypt.compare(user.password, foundUser.password))
        return foundUser
}

export {
    isValidObject,
    isValidUser,
    isAuthenticated
}