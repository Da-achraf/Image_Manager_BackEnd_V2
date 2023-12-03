import express from 'express'
import cors from 'cors'
import { dbInstance, CorsOptions } from './config/index.js'
import { Authorization } from './middlewares/index.js'
import {authRouter, imageRouter, themeRouter} from './routing/index.js'
import fileUpload from "express-fileupload";

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors(CorsOptions))
// Setting the authorization middleware for the routes /customer/auth/*
app.use('/api/auth/*', Authorization.authMiddleware);
app.post('/api/auth/image', fileUpload())

// app.get('/test', async (req, res) => {
//     const imageService = new ImageService()
//     // const data = await imageService.calculateHistogram("https://res.cloudinary.com/dzf7sq2zr/image/upload/v1701365455/mkjh42ckunk7rz04hmbo.jpg")
//     const data = await imageService.calculateDominantColors("https://res.cloudinary.com/dzf7sq2zr/image/upload/v1701365455/mkjh42ckunk7rz04hmbo.jpg")
//     res.send(data)
// })

await dbInstance.connect()

app.use('/api', authRouter)
app.use('/api/auth/theme', themeRouter)
app.use('/api/auth/image', imageRouter)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})