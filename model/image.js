import { DataTypes } from 'sequelize'
import { dbInstance } from "../config/index.js";

const Image = dbInstance.sequelize.define('Image',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mimeType:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        size:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        width:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        height:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    
    {
        tableName: 'image'
    }
)

export {
    Image
}