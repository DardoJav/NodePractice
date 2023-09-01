import { Router } from 'express'
import { viewProductsController, 
    viewProductsFromCartController, 
    // viewRealTimeProductsController 
} from '../controllers/view.controller.js'

// import { auth } from '../utils.js'

const router = Router()


router.get('/', viewProductsController)

// router.get('/realTimeProducts', viewRealTimeProductsController)

router.get('/:cid', viewProductsFromCartController)


export default router