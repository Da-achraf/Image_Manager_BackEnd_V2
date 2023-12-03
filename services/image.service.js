import { Image, Theme } from "../model/index.js";
import { ERROR_CONSTANTS, FLASK_API } from "../constants/index.js";
import { Cloudinary } from "../config/index.js"
import {ImageUtilities} from "../utilities/index.js";
import axios from "axios";
import {ImageCharacteristicService} from "./image-characteritic.service.js";

const characteristics =  new ImageCharacteristicService()

class ImageService {
    async getOneById(id){
        if (!id)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)
        const foundImage = await Image.findByPk(id)
        if (foundImage){
            return {
                id: foundImage.id,
                name: foundImage.name,
                url: foundImage.url,
                publicId: foundImage.publicId,
                mimeType: foundImage.mimeType,
                size: foundImage.size,
                width: foundImage.width,
                height: foundImage.height,
                histogram: foundImage.histogram,
                dominantColors: foundImage.dominantColors,
                moments: foundImage.moments,
                gaborFilterValues: foundImage.gaborFilterValues,
                tamura: foundImage.tamura,
                ThemeId: foundImage.ThemeId,
                createdAt: foundImage.createdAt
            }
        }
        return null
    }

    async getImagesByThemeId(themeId) {
        if (!themeId)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)

        const theme = await Theme.findByPk(themeId, {include: ['images']})
        let images = []
        if (theme){
            images = theme.dataValues.images.map(image => image.dataValues)

            return images.map(image => ({
                id: image.id,
                name: image.name,
                url: image.url,
                publicId: image.publicId,
                mimeType: image.mimeType,
                size: image.size,
                width: image.width,
                height: image.height,
                histogram: image.histogram,
                dominantColors: image.dominantColors,
                moments: image.moments,
                gaborFilterValues: image.gaborFilterValues,
                tamura: image.tamura,
                ThemeId: image.ThemeId,
                createdAt: image.createdAt
            }))
        }
        return []
    }

    async saveImage(image){
        console.log('Decoding image...')
        let dataUri = await ImageUtilities.decode(image)
        console.log('Uploading to cloudinary...')
        const asset = await this.uploadImageToCloudinary(dataUri)
        console.log('Calculating histogram...')
        const histogram = await characteristics.histogram(asset.secure_url)
        console.log('Calculating dominant colors...')
        const dominantColors = await characteristics.dominantColors(asset.secure_url)
        console.log('Calculating moments...')
        // const moments = await characteristics.moments(asset.secure_url)
        console.log('Calculating gaborFilterValues...')
        // const gaborFilterValues = await characteristics.gaborFilter(asset.secure_url)
        console.log('Calculating tamura...')
        // const tamura = await characteristics.tamura(asset.secure_url)
        const imageToSave = {
            name: image.name,
            url: asset.secure_url,
            publicId: asset.public_id,
            mimeType: image.mimetype,
            width: asset.width,
            height: asset.height,
            size: image.size,
            histogram,
            dominantColors,
            // moments,
            // tamura,
            // gaborFilterValues,
            ThemeId: image.themeId
        }
        console.log('Saving to database...')
        return await this.saveOne(imageToSave)
    }


    async saveOne(image){
        const validation =  image.name && image.url && image.publicId && image.size &&
                            image.mimeType && image.ThemeId && image.width
                            && image.height
        if (!validation)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)
        try {
            const savedImage = await Image.create(image)
            return {
                id: savedImage.dataValues.id,
                name: savedImage.dataValues.name,
                url: savedImage.dataValues.url,
                publicId: savedImage.dataValues.publicId,
                mimeType: savedImage.dataValues.mimeType,
                size: savedImage.dataValues.size,
                width: savedImage.dataValues.width,
                height: savedImage.dataValues.height,
                histogram: savedImage.histogram,
                dominantColors: savedImage.dominantColors,
                // moments: savedImage.moments,
                // gaborFilterValues: savedImage.gaborFilterValues,
                // tamura: savedImage.tamura,
                ThemeId: savedImage.dataValues.ThemeId,
                createdAt: savedImage.dataValues.createdAt
            }
        }catch (error){
            console.log(`Error Occurred, Details: ${JSON.stringify(error)}`)
            throw error
        }
    }

    async uploadImageToCloudinary(dataUri){
        return await Cloudinary.uploader.upload(dataUri, {timeout: 200000})
    }

    async deleteImageFromCloudinary(imagePublicId){
        await Cloudinary.uploader.destroy(imagePublicId)
    }

    async deleteOne(imageId){
        if (!imageId)
            throw new Error(ERROR_CONSTANTS.BAD_ARGUMENTS)
        try {
            const imageToBeDeleted = await this.getOneById(imageId)
            const deleted = await Image.destroy({where: {id: imageId}});
            if (deleted === 1){
                await this.deleteImageFromCloudinary(imageToBeDeleted.publicId)
                return {
                    id: imageToBeDeleted.id
                }
            }
        }catch (error){
            throw error
        }
    }

    async delete(imageIds) {
        if (imageIds?.length <= 0)
            throw new Error(ERROR_CONSTANTS.BAD_ARGUMENTS)
        try {
            let deleteImages = []
            for (const imageId of imageIds) {
                const deleteImage = await this.deleteOne(imageId)
                deleteImages.push({
                    id: deleteImage.id,
                })
            }
            return deleteImages
        }catch (error){
            console.log('Error: ', error)
            throw error
        }
    }

}

export {
    ImageService
}