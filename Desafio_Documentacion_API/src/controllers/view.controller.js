// import productModel from "../dao/models/product.model.js"
// import { getProductsFromCart } from "./cart.controller.js"
import { CartService, ProductService } from "../services/index.js"


export const viewProductsController = async (req, res) => {
    try {
        const result = await ProductService.getAllPaginate(req)
        if(result.statusCode === 200) {
            res.render('products', {products: result.response, user: result.response.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch(err) {
        logger.error(`error on viewProductsController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

// export const viewRealTimeProductsController = async (req, res) => {

// }

export const viewProductsFromCartController = async (req, res) => {
    try{
        // const result = await getProductsFromCart(req, res)
        const result = await CartService.getProductsFromCart(req)
        result.user = req.user.user
        if(result.statusCode === 200) {
            res.render('productsFromCart', {cart: result.response.payload, user: result.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch (err) {
        logger.error(`error on viewProductsFromCartController: ${err.message}`)
        return res.status(500).json({status: 'error', error: err.message})
    }
}