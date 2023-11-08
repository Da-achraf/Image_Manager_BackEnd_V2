import cloudinary from 'cloudinary'
import { CLOUDINARY_CONSTANTS } from '../constants/index.js'

const Cloudinary = cloudinary.v2

Cloudinary.config({
    cloud_name: CLOUDINARY_CONSTANTS.CLOUD_NAME,
    api_key: CLOUDINARY_CONSTANTS.API_KEY,
    api_secret: CLOUDINARY_CONSTANTS.API_SECRET,
})


export {
    Cloudinary
}