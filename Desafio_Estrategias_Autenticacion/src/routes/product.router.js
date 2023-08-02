import { Router } from 'express'
import { productModel } from '../dao/models/product.model.js'
import { auth } from '../middleware/auth.js'


const router = Router()


export const getProducts = async (req, res) => {
    try{
        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        const filterOptions = {}
        if (req.query.stock) filterOptions.stock = req.query.stock
        if (req.query.category) filterOptions.category = req.query.category
        const paginateOptions = { lean: true, limit, page}
        if (req.query.sort === 'asc') paginateOptions.sort = {price: 1}
        if (req.query.sort === 'desc') paginateOptions.sort = {price: -1}
        const result = await productModel.paginate(filterOptions, paginateOptions)
        let prevLink
        if(!req.query.page){
            prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
            prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
        }
        let nextLink
        if(!req.query.page){
            nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
            nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
        }
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
                prevLink: result.hasPrevPage? prevLink: null,
                nextLink: result.hasNextPage? nextLink: null
            }
        }
    }catch (err){
        console.log(err)
        return {
            statusCode: 500,
            response: {status: 'error', error: err.message}
        }
    }
}


router.post('/', auth, async (req, res) => {
    const product = req.body
    try {
        const result = await productModel.create(product)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})


router.get('/', auth, async (req, res) => {
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
        result.username = req.session.user.username
        res.render('products', result)
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:pid', auth, async (req, res) => {
    try{
        const pid = req.params.pid
        const product = await productModel.findById(pid)
        return res.status(200).json({status: 'success', payload: product})
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: 'error', error: err.message })
    }
})


router.delete('/:pid', auth, async (req, res) => {
    const id = req.params.pid
    try {
        const result = await productModel.deleteOne({ _id: id})
        console.log(result)
        res.status(200).json({ status: 'success', payload: 'Product deleted successfully' })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})


router.put('/:pid', auth, async (req, res) => {
    const product = req.body
    try {
        const result = await productModel.updateOne({ _id: req.params.pid }, { $set: product })
        res.status(200).json({ status: 'success', payload: 'Product updated successfully' })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router