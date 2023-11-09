import { CartService, ProductService } from "../services/index.js"
import logger from "../logger.js";

export const createCartController = async (req, res) => {
    try{
        const result = await CartService.create()
        return res.status(200).json({status: 'success', payload: result})
    } catch (err){
        logger.error(`error on createCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductsFromCartController = async (req, res) => {
    try{
        const result = await CartService.getProductsFromCart(req)
        result.user = req.user.user
        if(result.statusCode === 200) {
            return res.status(result.statusCode).json({cart: result.response.payload, user: result.user})
        } else {
            return res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch (err) {
        logger.error(`error on getProductsFromCartController: ${err}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const getCartFromUserController = async (req, res) => {
    try{
        const user = req.user.user
        return res.status(200).json({status: 'success', payload: user})
    } catch (err){
        logger.error(`error on getCartFromUserController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const addProductToCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        const productToAdd = await ProductService.getById(pid)
        if(req.user.user.email == productToAdd.owner){
            return res.status(404).json({status: 'error', error: `you cannot add a product of your ownership`})
        }
        if (productToAdd === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if (productIndex > -1){
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({product: pid, quantity:1})
        }
        const result = await CartService.update(cid,cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        logger.error(`error on addProductToCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const clearCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        cartToUpdate.products = []
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        logger.error(`error on clearCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        const products = req.body.products
        if (!products){
            return res.status(404).json({status: 'error', error: 'Field "products" is not optional'})
        }
        for (let index = 0; index < products.length; index++){
            if(!products[index].hasOwnProperty('products') || !products[index].hasOwnProperty('quantity')){
                return res.status(400).json({status: 'error', error: 'product must have a valid id and a valid quantity'})
            }
            if(typeof products[index].quantity !== 'number') {
                return res.status(400).json({status: 'error', error: 'product quantity must have a number'})
            }
            if(products[index].quantity === 0) {
                return res.status(400).json({status: 'error', error: 'product quantity cannot be 0'})
            }
            const productToAdd = await ProductService.getById(products[index].product)
            if (productToAdd === null){
                return res.status(404).json({status: 'error', error: `product with id=${products[index].product} does not exists`})
            }
        }
        cartToUpdate.products = products
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        logger.error(`error on updateCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateProductQtyFromCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        productToAdd = await ProductService.getById(pid)
        if (productToAdd === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const quantity = req.body.quantity
        if(!quantity) {
            return res.status(400).json({status: 'error', error: 'Field quantity is not optional'})
        }
        if(typeof quantity !== 'number') {
            return res.status(400).json({status: 'error', error: 'product quantity must be a number'})
        }
        if(quantity === 0) {
            return res.status(400).json({status: 'error', error: 'product quantity cannot be 0'})
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex === -1) {
            return res.status(400).json({status: 'error', error: `product with id=${cid} not found in cart with id=${cid}`})
        } else{
            cartToUpdate.products[productIndex].quantity = quantity
        }
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        logger.error(`error on updateProductQtyFromCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const deleteProductFromCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        const productToDelete = await ProductService.getById(pid)
        if (productToDelete === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if (productIndex === -1){
            return res.status(400).json({status: 'error', error: `product with id=${cid} not found in cart with id=${cid}`})
        } else {
            cartToUpdate.products = cartToUpdate.products.filter(item => item.product._id !== pid)
        }
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        logger.error(`error on deleteProductFromCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

//NOTA:
//asumi lo siguiente:
//en caso de que haya algun producto que no tiene suficiente stock antes de generar el ticket de compra:
// actualizo el cart en la bd con esos productos y devuelvo un 409 con dichos productos en un array de rta (no genero ningun ticket de compra)
// caso contrario genero el ticket de compra en la bd y devuelvo un 200
export const purchaseCartController = async (req, res) => {
    try{
        const result = await CartService.purchaseCart(req)
        if(result.statusCode === 200) {
            return res.status(result.statusCode).json({status: 'success', payload: result.response.payload})
        } else {
            return res.status(result.statusCode).json({status: 'error', error: result.response.error, products: result.response.products})
        }
    }catch (err){
        logger.error(`error on purchaseCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}