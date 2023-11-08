import express from 'express'
import {ImageService} from "../services/index.js";
import {ERROR_CONSTANTS, INFO_CONSTANTS} from "../constants/index.js";
import {Cloudinary, dbInstance} from "../config/index.js"
import {ImageUtilities} from "../utilities/index.js";

const imageRouter = express.Router()
const imageService = new ImageService()

// One Image By ID
imageRouter.get('/:id', async (req, res) => {
    const imageId = req.params.id
    try {
        const image = await imageService.getOneById(imageId)
        res.status(200).json({
            status: 200,
            message: INFO_CONSTANTS.RETRIEVED_SUCCESS,
            data: image
        })
    }catch (error){
        console.log('Error', error)
        res.status(501).json({
            message: ERROR_CONSTANTS.UNKNOWN_ERROR,
            data: error.message
        })
    }
})

// All Images Of A Theme By Its ID
imageRouter.get('/theme/:id', async (req, res) => {
    const themeId = req.params.id
    try {
        const images = await imageService.getImagesByThemeId(themeId)
        res.status(200).json({
            status: 200,
            message: INFO_CONSTANTS.RETRIEVED_SUCCESS,
            data: images
        })
    }catch (error){
        console.log('Error', error)
        res.status(501).json({
            message: ERROR_CONSTANTS.UNKNOWN_ERROR,
            data: error.message
        })
    }
})


// Save A New Image(s) For A Specific Theme
imageRouter.post('/', async (req, res) => {
    let themeId = req.headers.themeid
    let images = []
    if (req.files.images)
        if (Array.isArray(req.files.images))
            images = req.files.images
        else
            images.push(req.files.images)
    try {
        let savedImages = []
        for (let image of images) {
            let dataUri = await ImageUtilities.decode(image)
            const asset = await imageService.uploadImage(dataUri)
            const imageToSave = {
                name: image.name,
                url: asset.secure_url,
                publicId: asset.public_id,
                mimeType: image.mimetype,
                width: asset.width,
                height: asset.height,
                size: image.size,
                ThemeId: themeId
            }
            const savedImage = await imageService.saveOne(imageToSave)
            savedImages.push(savedImage)
        }
        return res.status(200).json({ status: 200, message: INFO_CONSTANTS.UPLOAD_SUCCESS, data: savedImages});
    }
    catch (e){
        console.log('erooooor: ', e)
        return res.status(500).json({ status: 500, message: 'Image upload to Cloudinary failed', data: null })
    }
})


// Delete One Or A Bunch Of Images By Their Ids
imageRouter.delete('', async (req, res) => {
    const imagesIds = req.body
    try {
        const deletedImages = await imageService.delete(imagesIds)
        console.log('deletedImages: ', deletedImages)
        res.status(200).json({
            status: 200,
            message: INFO_CONSTANTS.DELETED_SUCCESS,
            data: deletedImages
        })
    }catch (error){
        console.log('Error: ', error)
        res.status(501).json({
            message: ERROR_CONSTANTS.UNKNOWN_ERROR,
            data: error.message
        })
    }
})


export {
    imageRouter
}