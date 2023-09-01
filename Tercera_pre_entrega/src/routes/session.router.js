import { Router } from "express";
// import UserModel from "../dao/models/user.model.js";
// import { isValidPassword } from "../utils.js";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";

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
router.get('/logout', (req, res) => {
    res.clearCookie(process.env.JWT_COOKIE_NAME).redirect('/session/login')
})

router.get('/current', (req, res) => {
    // console.log(req.user)
    if(!req.user) return res.status(401).json({status: 'error', error:'no session detected'})
    res.status(200).json({status: 'success', payload: new UserDTO(req.user)})
})

export default router