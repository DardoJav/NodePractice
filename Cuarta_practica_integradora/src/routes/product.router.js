import { Router } from 'express'
import { createProductController, 
    deleteProductController, 
    getAllProductsController, 
    getProductByIdController, 
    updateProductController } from '../controllers/product.controller.js'
import { handlePolicies, generateProducts } from '../utils.js'
// import { auth } from '../utils.js'

const router = Router()


router.post('/', handlePolicies(['ADMIN', 'PREMIUM']), createProductController)

router.post("/mockingproducts", handlePolicies(['ADMIN']), generateProducts); //creo que lo mejor es que se generen los productos y se los muestren en pantalla, es decir, despues del login

router.get('/', getAllProductsController)

router.get('/:pid', getProductByIdController)

router.delete('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), deleteProductController)

router.put('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), updateProductController)


export default router