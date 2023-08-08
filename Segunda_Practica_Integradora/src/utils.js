import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
// import passport from 'passport'
import UserModel from './dao/models/user.model.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) //dirname que contiene el path (reemplaza el ./src)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

//falta terminar de definir la strategy en base a si es un login por github o por por local
// una alternativa es usar el user y ver si esta en la base por ese email
// export const passportCall = strategy => {
//     return async(req, res, next) => {
//         passport.authenticate(strategy, function(err, user, info) {
//             if (err) return next(err)
//             if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
            
//             req.user = user
//             next()
//         })(req, res, next)
//     }
// }

export const auth = async (req, res, next) => {
    try {
        if(!req.session.user){
            return res.status(401).render('errors/base', { error: 'Not Authorized' })
        }
        const user = await UserModel.findOne({ email: req.session.user.email })
        if(!user){
            return res.status(401).render('errors/base', { error: 'Not Authorized' })
        }
        return next()
    }catch (err){
        console.log(err)
        return res.status(401).json({ status: 'fail', message: 'Auth error' })
    }
}

// export const auth = (req, res, next) => {
//     if (req.session?.user && req.session.user.username === 'admin@coderhouse.com') {
//         return next()
//     }
//     return res.status(401).json({ status: 'fail', message: 'Auth error' })
// }