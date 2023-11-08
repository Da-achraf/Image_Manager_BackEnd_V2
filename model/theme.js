import { DataTypes } from 'sequelize'
import { dbInstance } from "../config/index.js";

const Theme = dbInstance.sequelize.define('Theme', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            async isNotDuplicateLabel(value) {
                const found = await Theme.findOne({ where: { label: value, UserId: this.UserId }})
                if (found?.id)
                    throw new Error('Theme label already exists for this user!')
            }
        }
    }
},{
    tableName: 'theme',
})

export {
    Theme
}