import { Router } from 'express'
import { createProductController, 
    deleteProductController, 
    getAllProductsController, 
    getProductByIdController, 
    updateProductController } from '../controllers/product.controller.js'
import { handlePolicies, generateProducts } from '../utils.js'
// import { auth } from '../utils.js'

const router = Router()

//API para crear un producto nuevo
router.post('/', handlePolicies(['ADMIN', 'PREMIUM']), createProductController)

//API para generar 50 products nuevos al azar
router.post("/mockingproducts", handlePolicies(['ADMIN']), generateProducts);

//API para listar todos los productos
router.get('/', getAllProductsController)

//API tomar un producto por su ID
router.get('/:pid', getProductByIdController)

//API para eliminar un producto por su ID
router.delete('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), deleteProductController)

//API para modificar un producto por su ID
router.put('/:pid', handlePolicies(['ADMIN', 'PREMIUM']), updateProductController)


export default router