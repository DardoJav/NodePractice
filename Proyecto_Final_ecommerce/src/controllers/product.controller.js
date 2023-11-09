import CustomError from "../services/errors/custom_error.js"
import EErros from "../services/errors/enums.js"
import { generateProductErrorInfo } from "../services/errors/info.js"
import { ProductService } from "../services/index.js"
import logger from "../logger.js";


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
        const result = await ProductService.create(product, req.user.user)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        logger.error(`error on createProductController: ${err.message}`)
        if(err.code == 1 || err.code == 2 || err.code == 3) next(err)
        res.status(500).json({ status: 'error', error_message: err.message })
    }
}

export const getAllProductsController = async (req, res) => {
    try {
        const result = await ProductService.getAllPaginate(req)
        if(result.statusCode === 200) {
            res.status(result.statusCode).json({products: result.response.payload, user: result.response.user})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch(err) {
        logger.error(`error on getAllProductsController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const getProductByIdController = async (req, res) => {
    try{
        const pid = req.params.pid
        const product = await ProductService.getById(pid)
        return res.status(200).json({status: 'success', payload: product})
    } catch(err) {
        logger.error(`error on getProductByIdController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateProductController = async (req, res) => {
    const product = req.body
    try {
        const result = await ProductService.update(req.params.pid, product, req.user.user)
        if(result.statusCode === 200) {
            res.status(result.statusCode).json({status: 'success', payload: 'Product updated successfully'})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch(err) {
        logger.error(`error on updateProductController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductController = async (req, res) => {
    const id = req.params.pid
    try {
        const result = await ProductService.delete(id, req.user.user)
        if(result.statusCode === 200) {
            res.status(result.statusCode).json({status: 'success', payload: 'Product deleted successfully'})
        } else {
            res.status(result.statusCode).json({status: 'error', error: result.response.error})
        }
    } catch(err) {
        logger.error(`error on deleteProductController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}