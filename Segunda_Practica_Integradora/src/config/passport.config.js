import passport from "passport"
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, extractCookie, generateToken, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import cartModel from "../dao/models/cart.model.js"
import passport_jwt from "passport-jwt"

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                return done(null, false)
            }
            const cartForNewUser = await cartModel.create({})

            const newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password: createHash(password),
                cart: cartForNewUser._id, 
                role: (email === 'adminCoder@coder.com') ? 'admin' : 'user'
            }
            
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user: '+ err.message)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user ) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch(err) {
            return done('error al intentar el login: ' + err.message)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CLIENT_BACKURL
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const userFromDB = await UserModel.findOne({ email: profile._json.email || " "})
            if (userFromDB) {
                const user = userFromDB
                const token = generateToken(user)
                user.token = token
                return done(null, user)
            } else {
                const cartForNewUser = await cartModel.create({})
                const newUser = await UserModel.create({
                    first_name: profile._json.name,
                    email: profile._json.email || " ",
                    password: " ", 
                    last_name: " ", 
                    age: " ", 
                    cart: cartForNewUser._id, 
                    role: 'user'
                })
                const user = newUser
                const token = generateToken(user)
                user.token = token
                return done(null, user)
            }
            
        } catch(err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport