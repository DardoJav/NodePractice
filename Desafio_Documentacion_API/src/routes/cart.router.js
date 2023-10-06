import { Router } from 'express'
import { addProductToCartController, 
    clearCartController, 
    createCartController, 
    deleteProductFromCartController,
    getProductFromCartController, 
    getProductFromUserController, 
    purchaseCartController, 
    updateCartController, 
    updateProductQtyFromCartController } from '../controllers/cart.controller.js'
import { handlePolicies } from '../utils.js'
// import { auth } from '../utils.js'

const router = Router()

//API para crear un carrito nuevo
router.post('/', createCartController)

//API para devolver el carrito segun su ID
router.get('/:cid', getProductFromCartController)

//API para devolver el carrito del usuario
router.get('/', getProductFromUserController)

//API para eliminar el carrito
router.delete('/:cid', clearCartController)

//API para actualizar un carrito segun su ID
router.put('/:cid', updateCartController)

//API para agregar un producto X al carrito X
router.post('/:cid/product/:pid', handlePolicies(['USER']),addProductToCartController)

//API para actualzar un producto X del carrito X
router.put('/:cid/product/:pid', updateProductQtyFromCartController)

//API para eliminar un producto X del carrito X
router.delete('/:cid/product/:pid', deleteProductFromCartController)

//API para crear ticket y finalizar proceso de compra
router.post('/:cid', purchaseCartController)

export default router