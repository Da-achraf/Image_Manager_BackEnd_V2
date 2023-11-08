import {ERROR_CONSTANTS} from "../constants/index.js";

class ImageUtilities {
    static async decode(image){
        if (!image) {
            throw new Error(ERROR_CONSTANTS.BAD_REQ_PARAMS)
        }

        // if (!/^image/.test(image.mimetype)){
        //     throw new Error(ERROR_CONSTANTS.BAD_FILE)
        // }

        // Convert the image buffer to a Data URI (Base64 encoded)
        return `data:${image.mimetype};base64,${image.data.toString('base64')}`
    }
}

export {
    ImageUtilities
}