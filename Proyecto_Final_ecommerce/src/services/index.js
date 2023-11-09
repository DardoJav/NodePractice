import { Product } from '../dao/product.factory.js'
import ProductRepository from '../repositories/product.repository.js'

import CartDAO from '../dao/cart.mongo.dao.js'
import CartRepository from '../repositories/cart.repository.js'


export const ProductService = new ProductRepository(new Product())
export const CartService = new CartRepository(new CartDAO)