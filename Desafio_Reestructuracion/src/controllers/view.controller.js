import productModel from "../dao/models/product.model.js"
import { getProductsFromCart } from "./cart.controller.js"


export const viewProductsController = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        const filterOptions = {}
        if (req.query.stock) filterOptions.stock = req.query.stock
        if (req.query.category) filterOptions.category = req.query.category
        const paginateOptions = { lean: true, limit, page}
        if (req.query.sort === 'asc') paginateOptions.sort = {price: 1}
        if (req.query.sort === 'desc') paginateOptions.sort = {price: -1}
        const result = await productModel.paginate(filterOptions, paginateOptions)
        
        result.prevLink = result.hasPrevPage 
                            ? `/products/?page=${result.prevPage}&limit=${result.limit}`
                            : ''                        
        result.nextLink = result.hasNextPage 
                            ? `/products/?page=${result.nextPage}&limit=${result.limit}`
                            : ''
        result.user = req.user.user
        res.render('products', result)
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

// export const viewRealTimeProductsController = async (req, res) => {

// }

export const viewProductsFromCartController = async (req, res) => {
    try{
        const result = await getProductsFromCart(req, res)
        result.user = req.user.user
        if(result.statusCode === 200) {
            res.render('productsFromCart', {cart: result.response.payload, user: result.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: 'error', error: err.message})
    }
}