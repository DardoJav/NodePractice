import { Router } from 'express'
import { ProductManager } from '../controllers/ProductManager.js'

const router = Router()
const productManager = new ProductManager('./public/productos.json')

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts(limit)
    return res.status(200).json({status: 'success', products})
})

router.get('/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await productManager.getProductById(id)
    if (product == 'El producto no existe') return res.status(404).json({status: 'error', detalle: 'El producto no existe'})
    return res.status(200).json({status: 'success', product})
})

router.post('/', async (req, res) => {
    const result = await productManager.addProduct(req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category, req.body.thumbnail)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: result})
    return res.status(200).json({status: 'success', detalle: 'producto agregado con exito'})
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid
    const result = await productManager.updateProduct(id, req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category, req.body.thumbnail)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: result})
    return res.status(200).json({status: 'success', detalle: 'producto actualizado con exito'})
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const result = await productManager.deleteProduct(id)
    if (result != 'passed') return res.status(400).json({status: 'error', detalle: 'El producto a eliminar no existe'})
    return res.status(200).json({status: 'success', detalle: 'producto eliminado con exito'})
})

export default router