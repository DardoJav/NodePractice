import { Router } from 'express'
import { CartManager } from '../controllers/CartManager.js'

const router = Router()
const cartManager = new CartManager('./public/carrito.json')

router.post('/', async (req, res) => {
    const result = await cartManager.addCart(req.body.products)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: result})
    return res.status(200).json({status: 'success', detalle: 'Carrito agregado con exito'})
})

router.get('/:cid', async (req, res) => {
    const id = req.params.cid
    const cart = await cartManager.getCartById(id)
    if (!cart) return res.status(404).json({status: 'error', detalle: 'El carrito no existe'})
    return res.status(200).json({status: 'success', cart})
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const result = await cartManager.addProductToCart(cartId, productId, req.body.quantity)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: result})
    return res.status(200).json({status: 'success', detalle: 'Producto agregado al carrito con éxito'})
})

export default router