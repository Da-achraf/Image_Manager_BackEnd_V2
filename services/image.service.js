import { Image, Theme } from "../model/index.js";
import { ERROR_CONSTANTS } from "../constants/index.js";
import { Cloudinary } from "../config/index.js"

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
                ThemeId: image.ThemeId,
                createdAt: image.createdAt
            }))
        }
        return []
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
                ThemeId: savedImage.dataValues.ThemeId,
                createdAt: savedImage.dataValues.createdAt
            }
        }catch (error){
            console.log(`Error Occurred, Details: ${JSON.stringify(error)}`)
            throw error
        }
    }

    async uploadImage(dataUri){
        return await Cloudinary.uploader.upload(dataUri)
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