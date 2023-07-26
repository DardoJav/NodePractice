import mongoose from "mongoose"
// import mongoosePaginate from "mongoose-paginate-v2";

// const cartCollection = 'carts'

// const cartSchema = new mongoose.Schema({
//     products: {
//         type:[{
//                 _id: false,
//                 product:{
//                     type:mongoose.Schema.Types.ObjectId,
//                     ref:"products"
//                 },
//                 quantity: Number
//             }],
//         default:[]
//     }
// })

// cartSchema.plugin(mongoosePaginate)

// export const cartModel = mongoose.model(cartCollection, cartSchema)

const cartSchema = new mongoose.Schema({

    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        default: []
    }
})

mongoose.set('strictQuery', false)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel