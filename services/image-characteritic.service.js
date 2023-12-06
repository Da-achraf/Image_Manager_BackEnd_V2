import {FLASK_API} from "../constants/index.js";
import axios from "axios";

class ImageCharacteristicService {
    async histogram(imageUrl){
        const url = `${FLASK_API.URL}/histogram?image_url=${imageUrl}`
        const response = await axios.get(url)
        return response.data.histogram
    }

    async dominantColors(imageUrl){
        const url = `${FLASK_API.URL}/dominant_colors?image_url=${imageUrl}`
        const response = await axios.get(url)
        return response.data.dominantColors
    }

    async moments(imageUrl){
        const url = `${FLASK_API.URL}/moments?image_url=${imageUrl}`
        const response = await axios.get(url)
        return response.data.moments
    }

    async gaborFilter(imageUrl){
        const url = `${FLASK_API.URL}/gabor_filter?image_url=${imageUrl}`
        const response = await axios.get(url)
        return response.data.gaborFilterValues
    }

    async tamura(imageUrl){
        const url = `${FLASK_API.URL}/tamura_features?image_url=${imageUrl}`
        const response = await axios.get(url)
        return response.data.tamura
    }
}


export {
    ImageCharacteristicService
}