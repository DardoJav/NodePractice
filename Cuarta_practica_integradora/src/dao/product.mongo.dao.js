import logger from '../logger.js'
import productModel from './models/product.model.js'

export default class ProductDAO {
    getAll = async() => await productModel.find()
    getById = async(id) => await productModel.findById(id)
    getAllPaginate = async(req) => {
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
            return {
                statusCode: 200,
                response: {
                    status: 'success',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage? result.prevLink: null,
                    nextLink: result.hasNextPage? result.nextLink: null,
                    user: req.user.user
                }
            }
        } catch(err) {
            logger.error(`error on productDao getAllPaginate: ${err.message}`)
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message}
            }
        }
    }
    create = async(data) => await productModel.create(data)
    update = async(id, data, user) => { 
        try {
            //agregar validacion si es premium owner del producto o admin
            const product = await productModel.findById(id)
            if(!product){
                return {
                    statusCode: 404,
                    response: { status: 'error', error: 'product not found'}
                }
            }
            if(product.owner != user.email && user.role != 'admin'){
                return {
                    statusCode: 401,
                    response: { status: 'error', error: 'Not authorized to edit product'}
                }
            }
            const result = await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
            return {
                statusCode: 200,
                response: {
                    status: 'success',
                    payload: result
                }
            }
        } catch(err) {
            logger.error(`error on productDao update: ${err.message}`)
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message}
            }
        }
    }
    delete = async(id, user) => { 
        try {
            const product = await productModel.findById(id)
            if(!product){
                return {
                    statusCode: 404,
                    response: { status: 'error', error: 'product not found'}
                }
            }
            if(product.owner != user.email && user.role != 'admin'){
                return {
                    statusCode: 401,
                    response: { status: 'error', error: 'Not authorized to edit product'}
                }
            }
            await productModel.findByIdAndDelete(id)
            return {
                statusCode: 200,
                response: {
                    status: 'success',
                    payload: result
                }
            }
        } catch(err) {
            logger.error(`error on productDao delete: ${err.message}`)
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message}
            }
        }
    }
    
}