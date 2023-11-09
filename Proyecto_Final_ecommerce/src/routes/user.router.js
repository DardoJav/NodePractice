import { Router } from 'express'
import { createUserController, 
    getUserByIdController, 
    getUsersController,
    deleteUserController, 
    deleteInactiveUsersController,
    updateUserController,
    changeUserRoleByIdController} from '../controllers/user.controller.js'
import { handlePolicies } from '../utils.js'

const router = Router()

//API para crear un user nuevo
router.post('/', handlePolicies(['ADMIN']), createUserController)

//API para cambiar un user role a premium y viceversa
router.get('/:uid', handlePolicies(['ADMIN']), getUserByIdController)

//API para devolver todos los users
router.get('/', handlePolicies(['ADMIN']), getUsersController)

//API para eliminar un user
router.delete('/:uid', handlePolicies(['ADMIN']), deleteUserController)

//API para eliminar los users inactivos los ultimos 30 dias
router.delete('/', handlePolicies(['ADMIN']), deleteInactiveUsersController)

//API para actualizar un user
router.put('/:uid', handlePolicies(['ADMIN']), updateUserController)

//API para cambiar un user role a premium y viceversa
router.patch('/premium/:uid', handlePolicies(['ADMIN']), changeUserRoleByIdController)

export default router