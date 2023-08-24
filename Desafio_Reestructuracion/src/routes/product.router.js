import { Router } from 'express'
import { createProductController, 
    deleteProductController, 
    getAllProductsController, 
    getProductByIdController, 
    updateProductController } from '../controllers/product.controller.js'
// import { auth } from '../utils.js'

const router = Router()


router.post('/', createProductController)

router.get('/', getAllProductsController)

router.get('/:pid', getProductByIdController)

router.delete('/:pid', deleteProductController)

router.put('/:pid', updateProductController)


export default router