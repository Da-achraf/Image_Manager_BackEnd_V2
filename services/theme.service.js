import {Theme, User} from "../model/index.js";
import {ERROR_CONSTANTS} from "../constants/index.js";
import {ImageService} from "./image.service.js";

class ThemeService {
    async getOneById(id){
        if (!id)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)
        return await Theme.findByPk(id)
    }

    async getThemesByUserId(userId) {
        if (!userId)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)
        try {
            const user = await User.findByPk(userId, {include: ['themes']})
            return user.dataValues?.themes.map(theme => ({
                id: theme.dataValues.id,
                label: theme.dataValues.label,
                UserId: theme.dataValues.UserId,
            }))
        }catch (error){
            throw error
        }
    }

    async save(theme){
        const validation = theme.label && theme.UserId
        if (!validation)
            throw new Error(ERROR_CONSTANTS.VALIDATION_FAILED)
        try {
            const savedTheme = await Theme.create({
                label: theme.label,
                UserId: theme.UserId
            })
            return {
                id: savedTheme.dataValues.id,
                label: savedTheme.dataValues.label,
                UserId: savedTheme.dataValues.UserId,
            }
        }catch (error){
            throw new Error(error.errors[0].message)
        }
    }

    async deleteOne(themeId){
        const imageService = new ImageService()
        if (!themeId)
            throw new Error(ERROR_CONSTANTS.BAD_ARGUMENTS)
        try {
            const themeToBeDeleted = await this.getOneById(themeId)
            const themeImages = await imageService.getImagesByThemeId(themeId)
            await Theme.destroy({where: {id: themeId}});
            for (const image of themeImages) {
                await imageService.deleteImageFromCloudinary(image.publicId);
            }
            return themeToBeDeleted
        }catch (error){
            throw error
        }
    }

    async delete(themesIds) {
        if (themesIds?.length <= 0)
            throw new Error(ERROR_CONSTANTS.BAD_ARGUMENTS)
        try {
            let deleteThemes = []
            for (const themeId of themesIds) {
                const deletedTheme = await this.deleteOne(themeId)
                deleteThemes.push({
                    id: deletedTheme.dataValues.id,
                    label: deletedTheme.dataValues.label,
                    UserId: deletedTheme.dataValues.UserId,
                })
            }
            return deleteThemes
        }catch (error){
            console.log('Error: ', error)
            throw error
        }
    }
}


export {
    ThemeService
}