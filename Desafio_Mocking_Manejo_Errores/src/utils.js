import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
import passport from 'passport'
import jwt from 'jsonwebtoken'
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

export const generateToken = user => {
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h'})
    return token 
}

export const extractCookie = req => {
    return (req && req.signedCookies) ? req.signedCookies[process.env.JWT_COOKIE_NAME] : null
}

//middleware para autorizacion por jwt
export const passportCall = strategy => {
    return async(req, res, next) => {
        await passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
            req.user = user
            next()
        })(req, res, next)
    }
}

//middleware para autorizacion por sessiones
// export const auth = async (req, res, next) => {
//     try {
//         if(!req.session.user){
//             return res.status(401).render('errors/base', { error: 'Not Authorized' })
//         }
//         const user = await UserModel.findOne({ email: req.session.user.email })
//         if(!user){
//             return res.status(401).render('errors/base', { error: 'Not Authorized' })
//         }
//         return next()
//     }catch (err){
//         console.log(err)
//         return res.status(401).json({ status: 'fail', message: 'Auth error' })
//     }
// }

//handle policies middleware para cuando haya que usar policies
export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null
    if (policies.includes('ADMIN')) {
        if (user.role !== 'admin') {
            return res.status(403).render('errors/base', {
                error: 'Need to be an ADMIN'
            })
        }
    }
    if (policies.includes('USER')) {
        if (user.role !== 'user') {
            return res.status(403).render('errors/base', {
                error: 'Need to be a USER'
            })
        }
    }
    return next()
}

export const generateProduct = () => { //modificar para generar products usando faker (y falta manejo de errores)
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h'})
    return token 
}