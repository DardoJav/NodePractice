import { Router } from 'express'
import { viewProductsController, 
    viewProductsFromCartController, 
    // viewRealTimeProductsController 
} from '../controllers/view.controller.js'

const router = Router()

// Vista para devolver todos los productos
router.get('/', viewProductsController)

// router.get('/realTimeProducts', viewRealTimeProductsController)

// Vista para ver los productos de un carrito por su ID
router.get('/:cid', viewProductsFromCartController)


export default router