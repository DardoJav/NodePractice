// import cartModel from "../dao/models/cart.model.js"
// import productModel from "../dao/models/product.model.js"
import { CartService, ProductService } from "../services/index.js"


//Lee todos los productos del carrito
// export const getProductsFromCart = async (req, res) => {
//     try{
//         const id = req.params.cid
//         const result = await cartModel.findById(id).populate('products.product').lean()
//         if (result === null){
//             return {
//                 statusCode: 404, 
//                 response: {status: 'error', error: 'Not Found'}
//             }
//         }
//         return {
//             statusCode: 200,
//             response: {status: 'success', payload: result}
//         }
//     } catch (err) {
//         return {
//             statusCode: 500,
//             response: {status: 'error', error: err.message}
//         }
//     }
// }

export const createCartController = async (req, res) => {
    try{
        // const result = await cartModel.create({})
        const result = await CartService.create()
        return res.status(200).json({status: 'success', payload: result})
    } catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductFromCartController = async (req, res) => {
    try{
        // const result = await getProductsFromCart(req, res)
        const result = await CartService.getProductsFromCart()
        result.user = req.user.user
        if(result.statusCode === 200) {
            res.status(result.statusCode).json({cart: result.response.payload, user: result.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductFromUserController = async (req, res) => {
    try{
        const user = req.user.user
        return res.status(200).json({status: 'success', payload: user})
    } catch (err){
        consolr.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const addProductToCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        // const productToAdd = await productModel.findById(pid)
        const productToAdd = await ProductService.getById(pid)
        if (productToAdd === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if (productIndex > -1){
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({product: pid, quantity:1})
        }
        // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {returnDocument: 'after'})
        const result = await CartService.update(cid,cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const clearCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        cartToUpdate.products = []
        // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {returnDocument: 'after'})
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        const products = req.body.products
        //start: validaciones el array enviado por body
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
            // const productToAdd = await productModel.findById(products[index].product)
            const productToAdd = await ProductService.getById(products[index].product)
            if (productToAdd === null){
                return res.status(404).json({status: 'error', error: `product with id=${products[index].product} does not exists`})
            }
        }
        //end: validaciones el array enviado por body
        cartToUpdate.products = products
        // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {returnDocument: 'after'})
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateProductQtyFromCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        // productToAdd = await productModel.findById(pid)
        productToAdd = await ProductService.getById(pid)
        if (productToAdd === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const quantity = req.body.quantity
        //start: validaciones de quantity enviado por body
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
        //end: validaciones de quantity enviado por body
        // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {returnDocument: 'after'})
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}

export const deleteProductFromCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null){
            return res.status(404).json({status: 'error', error: `cart with id=${cid} not found`})
        }
        // const productToDelete = await productModel.findById(pid)
        const productToDelete = await ProductService.getById(pid)
        if (productToDelete === null){
            return res.status(404).json({status: 'error', error: `product with id=${cid} not found`})
        }
        const productIndex = cartToUpdate.produts.findIndex(item => item.product == pid)
        if (productIndex === -1){
            return res.status(400).json({status: 'error', error: `product with id=${cid} not found in cart with id=${cid}`})
        } else {
            cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        }
        // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {returnDocument: 'after'})
        const result = await CartService.update(cid, cartToUpdate)
        return res.status(200).json({status: 'success', payload: result})
    }catch (err){
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}