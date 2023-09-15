import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String },
})

mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)
export default productModel