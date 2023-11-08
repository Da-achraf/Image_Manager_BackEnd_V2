import { Sequelize } from 'sequelize'
import { DB_CONSTANTS } from '../constants/index.js'

class Database {
    static _instance = null; // Private instance variable
    constructor() {
        // Prevent external instantiation of this class
        if (Database._instance) {
            throw new Error('Singleton class. Use Database.getInstance()');
        }
        // Initialize the Sequelize instance
        this.sequelize = new Sequelize(
            process.env.MYSQL_DB || DB_CONSTANTS.DEFAULT_DB,
            process.env.DB_USER || DB_CONSTANTS.DEFAULT_USER,
            process.env.DB_PASSWORD || DB_CONSTANTS.DEFAULT_PASSWORD,
            {
                host: process.env.MYSQL_HOST || DB_CONSTANTS.DEFAULT_HOST,
                dialect: 'mysql'
            }
        );
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new Database();
        }
        return this._instance;
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

const dbInstance = Database.getInstance()

export {
    dbInstance
}