// import productModel from "../dao/models/product.model.js"
import CustomError from "../services/errors/custom_error.js"
import EErros from "../services/errors/enums.js"
import { generateProductErrorInfo } from "../services/errors/info.js"
import { ProductService } from "../services/index.js"


// export const getProducts = async (req, res) => {
//     try{
//         let page = parseInt(req.query.page) || 1
//         let limit = parseInt(req.query.limit) || 10
//         const filterOptions = {}
//         if (req.query.stock) filterOptions.stock = req.query.stock
//         if (req.query.category) filterOptions.category = req.query.category
//         const paginateOptions = { lean: true, limit, page}
//         if (req.query.sort === 'asc') paginateOptions.sort = {price: 1}
//         if (req.query.sort === 'desc') paginateOptions.sort = {price: -1}
//         const result = await productModel.paginate(filterOptions, paginateOptions)
//         let prevLink
//         if(!req.query.page){
//             prevLink = `http://${req.hostname}:${process.env.PORT}${req.originalUrl}&page=${result.prevPage}`
//         } else {
//             const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
//             prevLink = `http://${req.hostname}:${process.env.PORT}${modifiedUrl}`
//         }
//         let nextLink
//         if(!req.query.page){
//             nextLink = `http://${req.hostname}:${process.env.PORT}${req.originalUrl}&page=${result.nextPage}`
//         } else {
//             const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
//             nextLink = `http://${req.hostname}:${process.env.PORT}${modifiedUrl}`
//         }
//         return {
//             statusCode: 200,
//             response: {
//                 status: 'success',
//                 payload: result.docs,
//                 totalPages: result.totalPages,
//                 prevPage: result.prevPage,
//                 nextPage: result.nextPage,
//                 page: result.page,
//                 hasPrevPage: result.hasPrevPage,
//                 hasNextPage: result.hasNextPage,
//                 prevLink: result.hasPrevPage? prevLink: null,
//                 nextLink: result.hasNextPage? nextLink: null
//             }
//         }
//     }catch (err){
//         console.log(err)
//         return {
//             statusCode: 500,
//             response: {status: 'error', error: err.message}
//         }
//     }
// }

export const createProductController = async (req, res, next) => {
    const product = req.body
    try {
        if (!product.title || !product.description || !product.stock || !product.price || !product.category || !product.code) {
            CustomError.createError({
                name: 'product creation error',
                cause: generateProductErrorInfo(product),
                message: 'Error trying to create a product',
                code: EErros.INVALID_TYPES_ERROR
            })
        }
        const result = await ProductService.create(product)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        if(err.code == 1 || err.code == 2 || err.code == 3) next(err)
        res.status(500).json({ status: 'error', error_message: err.message })
    }
}

export const getAllProductsController = async (req, res) => {
    try {
        const result = await ProductService.getAllPaginate()
        if(result.statusCode === 200) {
            res.status(result.statusCode).json({products: result.response.payload, user: result.response.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const getProductByIdController = async (req, res) => {
    try{
        const pid = req.params.pid
        console.log(pid)
        // const product = await productModel.findById(pid)
        const product = await ProductService.getById(pid)
        return res.status(200).json({status: 'success', payload: product})
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateProductController = async (req, res) => {
    const product = req.body
    try {
        // const result = await productModel.updateOne({ _id: req.params.pid }, { $set: product })
        const result = await ProductService.update(req.params.pid, product)
        res.status(200).json({ status: 'success', payload: 'Product updated successfully' })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductController = async (req, res) => {
    const id = req.params.pid
    try {
        // const result = await productModel.deleteOne({ _id: id})
        const result = await ProductService.delete(id)
        res.status(200).json({ status: 'success', payload: 'Product deleted successfully' })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}