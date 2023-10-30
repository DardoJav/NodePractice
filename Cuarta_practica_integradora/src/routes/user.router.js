import { Router } from 'express'
import { createUserController, 
    getUserByIdController, 
    getUsersController,
    deleteUserController, 
    updateUserController,
    changeUserRoleByIdController} from '../controllers/user.controller.js'
import { handlePolicies } from '../utils.js'
// import { auth } from '../utils.js'

const router = Router()

//API para crear un user nuevo
router.post('/', createUserController)

//API para cambiar un user role a premium y viceversa
router.get('/:uid', getUserByIdController)

//API para devolver todos los users
router.get('/', getUsersController)

//API para eliminar un user
router.delete('/:uid', deleteUserController)

//API para actualizar un user
router.put('/:uid', updateUserController)

//API para cambiar un user role a premium y viceversa
router.patch('/premium/:uid', changeUserRoleByIdController)

export default router