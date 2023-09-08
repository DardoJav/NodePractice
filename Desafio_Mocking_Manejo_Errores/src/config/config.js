import dotenv from 'dotenv' 
dotenv.config()

//por ahora solo se esta usando el "persistence"
export default {
    apiserver: {
        port: process.env.PORT
    },
    persistence: process.env.PERSISTENCE,
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME
    }
}