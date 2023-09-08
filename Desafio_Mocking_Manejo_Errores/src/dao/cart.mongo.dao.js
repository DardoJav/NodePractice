import cartModel from './models/cart.model.js'
import ticketModel from './models/ticket.model.js'

export default class CartDAO {
    getAll = async() => await cartModel.find()
    getById = async(id) => await cartModel.findById(id)
    getProductsFromCart = async(req) => {
        try{
            const id = req.params.cid
            const result = await cartModel.findById(id).populate('products.product').lean()
            if (result === null){
                return {
                    statusCode: 404, 
                    response: {status: 'error', error: 'Cart Not Found'}
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
    purchaseCart = async(req) => {
        //TODO: 
        //enviar mail con el success de la compra en caso de que se haya podido hacer
        try{
            const id = req.params.cid
            const cartToPurchase = await cartModel.findById(id).populate('products.product').lean()
            //busco el cart y valido los productos
            if (cartToPurchase === null){
                return {
                    statusCode: 404, 
                    response: {status: 'error', error: 'Cart Not Found'}
                }
            }
            if(cartToPurchase.products.length == 0) {
                return {
                    statusCode: 404, 
                    response: {status: 'error', error: 'Cart has no Products'}
                }
            }
            const products = cartToPurchase.products
            let totalAmount = 0
            //recorro cada producto y valido quantity segun stock
            products.forEach((elem) => {
                if(parseInt(elem.product.stock) - elem.quantity > 0){
                    totalAmount += parseInt(elem.product.price)
                    cartToPurchase.products = cartToPurchase.products.filter(item => item.product._id !== elem.product._id)
                }
            });
            //dejo en cart los productos que no pudieron desontarse del stock y deevuelvo rta a la API
            await cartModel.findByIdAndUpdate(id, cartToPurchase, { returnDocument: 'after' })
            if(cartToPurchase.products.length > 0){
                return {
                    statusCode: 409,
                    response: {status: 'error', error: "Could not complete purchase, products with not enough stock", products: cartToPurchase.products}
                }
            }
            //genero ticket de compra y devuelvo rta a la API
            const datetime = Date.now().toString()
            const code = datetime.substring(datetime.length - 4, datetime.length);
            const newTicket = {
                code: code,
                amount: totalAmount,
                purchaser: req.user.user.email
            }
            const ticket = await ticketModel.create(newTicket)
            return {
                statusCode: 200,
                response: {status: 'success', payload: ticket}
            }
        } catch (err) {
            return {
                statusCode: 500,
                response: {status: 'error', error: err.message}
            }
        }
    }
}