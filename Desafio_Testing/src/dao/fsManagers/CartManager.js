import fs from 'fs'

export class CartManager{

    //Atributos
    #error
    
    //Contructor
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
        this.#error = 'passed'
    }

    //Metodos
    getCarts = async() => {
        try{
            const data = await fs.promises.readFile(this.path, this.format)
            if (!data) return []
            const carts = JSON.parse(data);
            return carts
        } catch (error){
            return (error)
        }
    }

    getCartById = async (id) => {
        try{
            const carts = await this.getCarts()
            const cart = carts.find(item => item.id == id)
            return cart
        } catch (error){
            return (error)
        }
    }

    #generateId = async() => {
        const carts = await this.getCarts()
        return (carts.length === 0) ? 1 : (carts[carts.length-1].id + 1)
    }

    addCart = async(products) => {
        try{
            const carts = await this.getCarts()
            carts.push({id: await this.#generateId(), products})
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null,'\t'))
            return ('passed')
        } catch (error){
            return(error)
        }
    }

    addProductToCart = async(cartId, productId, quantity) => {
        try{
            const carts = await this.getCarts()
            const cartIndex = carts.findIndex(elem => elem.id == cartId)
            if (cartIndex == -1) return 'El Carrito no existe'
            const products = carts[cartIndex].products
            const productIndex = products.findIndex(elem => elem.product == productId)
            if (productIndex == -1) {
                products.push({product: parseInt(productId), quantity: quantity})
            } else {
                products[productIndex].quantity += quantity
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null,'\t'))
            return ('passed')
        } catch (error){
            return(error)
        }
    }
    
}