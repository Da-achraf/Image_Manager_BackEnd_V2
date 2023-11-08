import express from 'express'
import {ThemeService} from "../services/index.js";
import {ERROR_CONSTANTS, INFO_CONSTANTS} from "../constants/index.js";

const themeRouter = express.Router()
const themeService = new ThemeService()

// All Themes By userId
themeRouter.get('/user/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const themes = await themeService.getThemesByUserId(userId)
        res.status(200).json({
            status: 200,
            message: INFO_CONSTANTS.RETRIEVED_SUCCESS,
            data: themes
        })
    }catch (error){
        res.status(501).json({
            message: ERROR_CONSTANTS.UNKNOWN_ERROR,
            data: null
        })
    }
})


// Save New Theme For A Specific User
themeRouter.post('/', async (req, res) => {
    const theme = req.body
    try {
        const savedTheme = await themeService.save(theme)
        res.status(201).json({
            status: 201,
            message: INFO_CONSTANTS.CREATED_SUCCESS,
            data: savedTheme
        })
    }
    catch (error){
        res.status(501).json({
            message: error.message,
            data: error.message
        })
    }
})

// Delete One Or A Bunch Of Themes By Their Ids
themeRouter.delete('', async (req, res) => {
    const themesIds = req.body
    try {
        const deletedThemes = await themeService.delete(themesIds)
        res.status(200).json({
            status: 200,
            message: INFO_CONSTANTS.DELETED_SUCCESS,
            data: deletedThemes
        })
    }catch (error){
        res.status(501).json({
            message: ERROR_CONSTANTS.UNKNOWN_ERROR,
            data: error.message
        })
    }
})


export {
    themeRouter
}