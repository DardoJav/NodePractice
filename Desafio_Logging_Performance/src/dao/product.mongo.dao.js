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
            return {
                statusCode: 500,
                response: { status: 'error', error: err.message}
            }
        }
    }
    create = async(data) => await productModel.create(data)
    update = async(id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await productModel.findByIdAndDelete(id)
}