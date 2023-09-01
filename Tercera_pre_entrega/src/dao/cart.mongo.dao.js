import cartModel from './models/cart.model.js'

export default class CartDAO {
    getAll = async() => await cartModel.find()
    getById = async(id) => await cartModel.findById(id)
    getProductsFromCart = async (req) => {
        try{
            const id = req.params.cid
            const result = await cartModel.findById(id).populate('products.product').lean()
            if (result === null){
                return {
                    statusCode: 404, 
                    response: {status: 'error', error: 'Not Found'}
                }
            }
            return {
                statusCode: 200,
                response: {status: 'success', payload: result}
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: {status: 'error', error: err.message}
            }
        }
    }
    create = async(data) => await cartModel.create(data)
    update = async(id, data) => await cartModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => await cartModel.findByIdAndDelete(id)
}