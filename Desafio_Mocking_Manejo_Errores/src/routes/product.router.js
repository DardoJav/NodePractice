import { Router } from 'express'
import { createProductController, 
    deleteProductController, 
    getAllProductsController, 
    getProductByIdController, 
    updateProductController } from '../controllers/product.controller.js'
import { handlePolicies } from '../utils.js'
// import { auth } from '../utils.js'

const router = Router()


router.post('/', handlePolicies(['ADMIN']),createProductController)

router.get('/', getAllProductsController)

router.get('/:pid', getProductByIdController)

router.delete('/:pid', handlePolicies(['ADMIN']), deleteProductController)

router.put('/:pid', handlePolicies(['ADMIN']), updateProductController)


export default router