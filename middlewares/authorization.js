import jwt from "jsonwebtoken";
import {JWT_KEY} from "../config/index.js";
import { ERROR_CONSTANTS } from "../constants/index.js";
import session from "express-session";

class Authorization {
    static get session(){
        return session({
            secret: "fingerprint_image_manager_app",
            resave: true,
            saveUninitialized: true,
        })
    }

    static authMiddleware(req, res, next){
        const token = req.headers?.authorization
        if (token) {
            jwt.verify(token, JWT_KEY, (err, data) => {
                if (!err) next();
                else
                    return res.status(401).json({
                        message: ERROR_CONSTANTS.NOT_AUTHORIZED,
                        data: null,
                    });
            });
        } else {
            return res.status(401).json({
                message: "Please login",
                data: null,
            });
        }
    }
}

export {
    Authorization
}