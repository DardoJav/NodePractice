import passport from "passport"
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import cartModel from "../dao/models/cart.model.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('email already exists')
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
            return done(null, user)
        } catch(err) {
            return done('error al intentar el login: ' + err.message)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.8e1a57385813e385',
        clientSecret: '4397d94bbb9d6c21d80c15bd5a607a58da02ce9f',
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                password: " "
            })
            return done(null, newUser)
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