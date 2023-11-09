import UserModel from "../dao/models/user.model.js";
import UserDTO from "../dto/user.dto.js";
import logger from "../logger.js";
import { sendEmail } from "../utils.js";


export const createUserController = async (req, res) => {
    const user = req.body
    try {
        const result = await UserModel.create(user)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        logger.error(`error on createUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error_message: err.message })
    }
}

export const getUsersController = async (req, res) => {
    try {
        let users = []
        const result = await UserModel.find()
        result.forEach(user => {
            users.push(new UserDTO(user))
        });
        res.status(200).json({ status: 'success', payload: users })
    } catch(err) {
        logger.error(`error on getUsersController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const getUserByIdController = async (req, res) => {
    try{
        const uid = req.params.uid
        const result = await UserModel.findById(uid)
        return res.status(200).json({status: 'success', payload: result})
    } catch(err) {
        logger.error(`error on getUserByIdController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateUserController = async (req, res) => {
    const user = req.body
    try {
        await UserModel.findByIdAndUpdate(req.params.uid, user, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: 'User updated successfully' })
    } catch(err) {
        logger.error(`error on updateUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const changeUserRoleByIdController = async (req, res) => {
    try {
        const uid = req.params.uid
        const user = await UserModel.findById(uid)
        if (!user){
            res.status(404).json({ status: 'error', error: 'user not found' })
        }
        switch (user.role) {
            case 'premium':
                user.role = 'user'
                break;
            case 'user':
                user.role = 'premium'
                break;
            case 'admin':
                return res.status(401).json({ status: 'error', error: 'User admin cannot change role' })
            default:
                break;
        }
        await UserModel.findByIdAndUpdate(req.params.uid, user, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: 'User role changed successfully' })
    } catch(err) {
        logger.error(`error on updateUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteUserController = async (req, res) => {
    const uid = req.params.uid
    try {
        await UserModel.findByIdAndDelete(uid, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: 'User deleted successfully' })
    } catch(err) {
        logger.error(`error on deleteUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteInactiveUsersController = async (req, res) => {
    try {
        const users = await UserModel.find()
        
        const currentDate = new Date(); 

        users.forEach(async user => {
            const timeDiff = currentDate - user.last_connection
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // --> calcula los ultimos 30 dias
            if(daysDiff > 30){
                await UserModel.findByIdAndDelete(user._id)
                await sendEmail('userDelete', null, user)
            }
        });
        //const minutesDiff = Math.floor(timeDiff / (1000 * 60)); --> calcula los ultimos 30 mins

        res.status(200).json({ status: 'success', payload: 'Users inactives deleted successfully' })

    } catch(err) {
        logger.error(`error on deleteUserInactiveController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}