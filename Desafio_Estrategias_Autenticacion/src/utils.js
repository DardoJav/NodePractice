import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
import passport from 'passport'


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
export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
            
            req.user = user
            next()
        })(req, res, next)
    }
}