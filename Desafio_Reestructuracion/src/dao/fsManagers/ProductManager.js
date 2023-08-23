import fs from 'fs'

export class ProductManager{

    //Atributos
    #error
    
    //Contructor
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
        this.#error = 'passed'
    }

    //Metodos
    getProducts = async(limit) => {
        try{
            const data = await fs.promises.readFile(this.path, this.format)
            if (!data) return []
            const products = JSON.parse(data);
            if (!limit) return products;
            const productsResult =  products.slice(0,limit)
            return productsResult
        } catch (error){
            return (error)
        }
    }

    getProductById = async (id) => {
        try{
            const products = await this.getProducts()
            const product = products.find(item => item.id == id)
            if (!product) return 'El producto no existe'
            return product
        } catch (error){
            return(error)
        }
    }

    #generateId = async() => {
        const products = await this.getProducts()
        return (products.length === 0) ? 1 : (products[products.length-1].id + 1)
    }

    //validacion para el ingreso de un nuevo producto
    #validateAddProduct = async (title, description, code, price, stock, category) => {
        const products = await this.getProducts()
        if (!title || !description || !price || !category || !code || !stock){
            this.#error = `[${title}]: tiene campos incompletos`
        } else if (products.find(item => item.code === code)){
            this.#error = `[${title}]: el code ingresado ya existe`
        }
        else this.#error = 'passed'
    }

    //validacion diferente a validateAddProduct, no se puede actualizar a un codigo que lo contenga otro producto
    #validateUpdateProduct = async (id, title, description, code, price, status, stock, category, thumbnail) => {
        const products = await this.getProducts()
        const product = products.find(item => item.code === code)
        if (!title || !description || !price || !category || !code || !stock){
            this.#error = `[${title}]: tiene campos incompletos`
        } else if (product && (product.id !== id)){
            this.#error = `[${title}]: el code ingresado ya existe`
        }
        else this.#error = 'passed'
    }

    addProduct = async(title, description, code, price, status, stock, category, thumbnail) => {
        try{
            await this.#validateAddProduct(title, description, code, price, stock, category)
            if (this.#error === 'passed'){
                const products = await this.getProducts()
                status = (!status ? true : status)
                products.push({id: await this.#generateId(), title, description, code, price, status, stock, category, thumbnail})
                await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
                return (this.#error)
            } else
                return(this.#error)
        } catch (error){
            return(error)
        }
    }

    updateProduct = async (id, title, description, code, price, status, stock, category, thumbnail) => {
        await this.#validateUpdateProduct(id, title, description, code, price, status, stock, category, thumbnail)
        if (this.#error === 'passed'){
            const products = await this.getProducts()
            const productIndex = products
            .findIndex(elem => elem.id == id)
            console.log(productIndex)
            products[productIndex].title = title
            products[productIndex].description = description
            products[productIndex].code = code
            products[productIndex].price = price
            products[productIndex].status = !status ? true : status
            products[productIndex].stock = stock
            products[productIndex].category = category
            products[productIndex].thumbnail = thumbnail
            await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
            return (this.#error)
        }
        return (this.#error)
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const productIndex = products.findIndex(elem => elem.id == id)
        if(productIndex == -1) return ('error')
        const productDeleted = products.splice(productIndex,1)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
        return ('passed')
    }
}

//Prueba
// const productManager = new ProductManager('./products.json')
// console.log(await productManager.getProducts())
// await productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
// await productManager.addProduct('producto prueba 2', 'Este es un producto prueba 2', 300, 'Sin imagen', 'abc156', 35)
// console.log(await productManager.getProducts())
// console.log(await productManager.getProductById(1))
// await productManager.updateProduct(1,'producto prueba actualizado', 'Este es un producto prueba actualizado', 200, 'Sin imagen', 'abc145', 25)
// await productManager.deleteProduct(2)