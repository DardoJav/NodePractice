import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import UserModel from './dao/models/user.model.js'
import {faker} from "@faker-js/faker"
import productModel from './dao/models/product.model.js'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'


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
    if (policies.includes('PREMIUM')) {
        if (user.role !== 'premium' && user.role !== 'admin') {
            return res.status(403).render('errors/base', {
                error: 'Need to be a PREMIUM or ADMIN user'
            })
        }
    }
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

function generarBooleanAleatorio() {
    const numeroAleatorio = Math.floor(Math.random() * 2);
    return numeroAleatorio === 1;
}

export function generarCodigoAleatorio(size) {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
  
    let codigo = '';
  
    for (let i = 0; i < size; i++) {
      const letraAleatoria = letras[Math.floor(Math.random() * letras.length)];
      codigo += letraAleatoria;
    }
  
    for (let i = 0; i < size; i++) {
      const numeroAleatorio = numeros[Math.floor(Math.random() * numeros.length)];
      codigo += numeroAleatorio;
    }
  
    return codigo;
  }


export const generateProducts = async (req, res) => { 
    try{
        let products = []
        for (let i=0; i<50; i++){ //genera 50 productos aleatorios y los guarda en BD
            products.push(
                {
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: generarCodigoAleatorio(4),
                    price: faker.commerce.price(),
                    status: generarBooleanAleatorio(),
                    stock: faker.number.int(200),
                    category: faker.commerce.product(),
                    thumbnail: faker.image.url(),
                    owner: req.user.user.email,
                }
            )
        }

        const savedProducts = await productModel.insertMany(products);

        return res.status(200).json({ status: 'success', savedProducts })
    } catch (err){
        res.status(500).json({ status: 'error', error: err.message })
    }
    
}

export const sendEmail = async (res, ticket) => { 
    try{
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        }
        let transporter = nodemailer.createTransport(config)
        let Mailgenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Thanks for your purchase',
                link: 'http://coderecomerce.com'
            }
        })
    
        let content = {
            body: {
                intro: 'Your purchase was completed succesfully!',
                //no se esta imprimiendo ni price ni purchaseCode
                //falta agregar el detalle de los productos al mail
                price: ticket.amount+"ARS$",
                purchaseCode: ticket.code,
                // table: { 
                //     data: [
                //         {
                //             item: 'Super bicicleta de ruedas cuadradas',
                //             description: 'Diviertete usando esta super bicicleta',
                //             price: 'ARS$ 1000.00'
                //         }
                //     ]
                // },
                outro: 'Sincerily yours, ASD'
            }
        }
        let mail = Mailgenerator.generate(content)

    
        let message = {
            from: process.env.NODEMAILER_USER,
            to: 'dardo.luna@gmail.com', //cambiar a ticket.purchaser
            subject: 'Thanks for your purchase',
            html: mail
        }
        // transporter.sendMail(message)
        //     .then(() => res.status(201).json({ status: 'success'}))
        //     .catch(err => res.status(500).json({ err }))

        await transporter.sendMail(message)

        return {
            statusCode: 200,
            response: {status: 'success'}
        }
 
    } catch (err){
        console.log(err)
        res.status(500).json({ status: 'error', error: err.message })
    }
    
}

