import express from 'express'
import { ProductManager } from './ProductManager.js'

const app = express()
const productManager = new ProductManager('./products.json')

app.get('/products', async (request, response) => {
    const limit = request.query.limit
    return response.send({Response: await productManager.getProducts(limit)})
})

app.get('/products/:id', async (request, response) => {
    const id = request.params.id
    return response.send({Response: await productManager.getProductById(id)})
})

app.listen(8080, () => console.log('Server running on PORT: 8080'))