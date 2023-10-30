// import productModel from "../dao/models/product.model.js"
import UserModel from "../dao/models/user.model.js";
import userModel from "../dao/models/user.model.js"
// import { ProductService } from "../services/index.js"
import logger from "../logger.js";


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
        const result = await UserModel.find()
        res.status(200).json({ status: 'success', payload: result })
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
        // const result = await productModel.updateOne({ _id: req.params.pid }, { $set: product })
        await UserModel.findByIdAndUpdate(req.params.uid, user, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: 'User updated successfully' })
        // if(result.statusCode === 200) {
        //     res.status(result.statusCode).json({status: 'success', payload: 'User updated successfully'})
        // } else {
        //     res.status(result.statusCode).json({status: 'error', error: result.response.error})
        // }
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
                return res.status(401).json({ status: 'error', error: 'user admin cannot change role' })
            default:
                break;
        }
        await UserModel.findByIdAndUpdate(req.params.uid, user, { returnDocument: 'after' })
        // const result = await productModel.updateOne({ _id: req.params.pid }, { $set: product })
        res.status(200).json({ status: 'success', payload: 'User role changed successfully' })
    } catch(err) {
        logger.error(`error on updateUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteUserController = async (req, res) => {
    const uid = req.params.uid
    try {
        //const result = await ProductService.delete(id)
        await UserModel.findByIdAndDelete(uid)
        res.status(200).json({ status: 'success', payload: 'User deleted successfully' })
        // if(result.statusCode === 200) {
        //     res.status(result.statusCode).json({status: 'success', payload: 'Product deleted successfully'})
        // } else {
        //     res.status(result.statusCode).json({status: 'error', error: result.response.error})
        // }
    } catch(err) {
        logger.error(`error on deleteUserController: ${err.message}`)
        res.status(500).json({ status: 'error', error: err.message })
    }
}