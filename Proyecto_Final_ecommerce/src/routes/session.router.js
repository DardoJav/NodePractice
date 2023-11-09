import { Router } from "express";
// import UserModel from "../dao/models/user.model.js";
// import { isValidPassword } from "../utils.js";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";
import { createHash, generarCodigoAleatorio, handlePolicies, isValidPassword } from "../utils.js";
import UserPasswordModel from "../dao/models/user-password.model.js";
import UserModel from "../dao/models/user.model.js";
import nodemailer from 'nodemailer'
import logger from "../logger.js";

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/session/failRegister'
}), async(req, res) => {
    res.redirect('/session/login')
})

//API para un registro fallido
router.get('/failRegister', (req, res) => {
    res.send({ error: 'Error trying to register!'})
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login con session
// router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin'}), async (req, res) => {
//     if (!req.user){
//         return res.status(400).send({status: 'error', error: 'invalid credentials'})
//     }
//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         email: req.user.email,
//         age: req.user.age,
//         role: req.user.role,
//         cart: req.user.cart._id
//     }
//     res.redirect('/products')
// })

// API para login con jwt
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin'}), async (req, res) => {
    if (!req.user){
        return res.status(400).send({status: 'error', error: 'invalid credentials'})
    }
    
    res.cookie(process.env.JWT_COOKIE_NAME, req.user.token, { signed: true} ).redirect('/products')
})

//API para un login fallido
router.get('/failLogin', (req, res) => {
    res.send({ error: 'Login Failed' })
})

//API para logueo con github
router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),
    async(req, res) => {}
)

//API para llamado de retorno desde github
router.get('/githubcallback', 
    await passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {

        if (!req.user){
            return res.status(400).send({status: 'error', error: 'invalid credentials'})
        }
        
        res.cookie(process.env.JWT_COOKIE_NAME, req.user.token, { signed: true} ).redirect('/products')

        // res.redirect('/products')
    }
)

// Cerrar Session usando Sesiones
// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if(err) {
//             console.log(err);
//             res.status(500).render('errors/base', {error: err})
//         } else res.redirect('/session/login')
//     })
// })

// Cerrar Session usando Cookie con JWT
router.get('/logout', async (req, res) => {//falta hacer lo de last connection del user en la bd
    try {
        await UserModel.findOneAndUpdate({email: req.user.email}, {last_connection: Date.now()}, { returnDocument: 'after' })
        res.clearCookie(process.env.JWT_COOKIE_NAME).redirect('/session/login')
    } catch(err) {
        logger.error(`error on logout: ${err.message}`)
        res.status(500).json({ status: 'error', error_message: err.message })
    }
})

//API para obtener datos del usuario de la sesion con DTO
router.get('/current', handlePolicies(['ADMIN']), (req, res) => {
    if(!req.user) return res.status(401).json({status: 'error', error:'no session detected'})
    res.status(200).json({status: 'success', payload: new UserDTO(req.user)})
})

//Vista para verificar el token para reset del password
router.get('/verify-token/:token', async (req, res) => {
    const userPassword = await UserPasswordModel.findOne({token: req.params.token})
    if(!userPassword){
        logger.error(`error verificando el token: Token no válido / El Token ha expirado`)
        return res.status(404).json({ status: 'error', error: 'Token no válido / El Token ha expirado'} )
    }
    const user = userPassword.email
    res.render('sessions/reset-password', { user })
})

//Vista para forget-password
router.get('/forget-password', (req, res) => {
    res.render('sessions/forget-password')
})

//API de forget-password
router.post('/forget-password', async (req, res) => {
    try {
        const email = req.body.email
        const user = await UserModel.findOne({ email })
        if (!user){
            return res.status(404).json({ status: 'error', error: 'User not found' })
        }
        const token = generarCodigoAleatorio(16)
        await UserPasswordModel.create({ email, token })
        const mailerConfig = {
            service: 'gmail',
            auth: { user: process.env.NODEMAILER_USER , pass: process.env.NODEMAILER_PASS}
        }
        let transporter = nodemailer.createTransport(mailerConfig)
        let message = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: '[Coder Ecommerce API] Reset Password',
            html: `<h1>[Coder Ecommerce API] Reset your password</h1><hr />You have asked to reset your password. You can do this here: <a href="${process.env.BASE_URL}:${process.env.PORT}/session/verify-token/${token}">Reset Password Link</a>`
        }
        await transporter.sendMail(message)
        res.json({ status: 'success', message: `email succesfully sent to ${email} in order to reset password` })
    } catch(err) {
        logger.error(`error on forget-password: ${err.message}`)
        res.status(500).json({ status: 'error', error_message: err.message })
    }

})

//API para reset del password
router.post('/reset-password/:user', async (req, res) => {
    try{
        const user = await UserModel.findOne({ email: req.params.user })
        if(isValidPassword(user,req.body.password)){
            return res.status(400).send({status: 'error', error: 'No puede ingresar la misma contraseña'})
        }
        await UserModel.findByIdAndUpdate(user._id, { password: createHash(req.body.password) })
        res.json({ success: 'success', message: 'Se ha creado una nueva contraseña' })
        await UserPasswordModel.deleteOne({ email: req.params.user })
    } catch(err) {
        logger.error(`error on Reset Password: ${err.message}`)
        res.status(500).json({ status: 'error', error_message: err.message })
    }
})

export default router