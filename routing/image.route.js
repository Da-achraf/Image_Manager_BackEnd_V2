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
    try {
        let themeId = req.headers.themeid
        let images = []
        if (req.files.images)
            if (Array.isArray(req.files.images))
                images = req.files.images
            else
                images.push(req.files.images)
        // Process images in parallel using Promise.all
        const savedImagesPromises = images.map(async (image) => {
            return await imageService.saveImage({ ...image, themeId });
        });

        // Wait for all promises to be resolved
        const savedImages = await Promise.all(savedImagesPromises);
        return res.status(200).json({ status: 200, message: INFO_CONSTANTS.UPLOAD_SUCCESS, data: savedImages});
    }
    catch (e){
        console.log('erooooor: ', e)
        return res.status(500).json({ status: 500, message: e.message, data: null })
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





// let savedImages = []
// for (let image of images) {
//     const testSavedImage = await imageService.saveImage({...image, themeId})
//     savedImages.push(testSavedImage)
// }