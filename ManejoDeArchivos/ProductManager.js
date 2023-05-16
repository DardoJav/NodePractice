import fs from 'fs'

class ProductManager{

    //Atributos
    #error
    
    //Contructor
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
        this.#error = 'passed'
    }

    //Metodos
    getProducts = async() => {
        try{
            // return JSON.parse(await fs.promises.readFile(this.path, this.format))
            const data = await fs.promises.readFile(this.path, this.format)
            if (data) {
                const prod = JSON.parse(data);
                return prod;
             } else {
                return [];
             }
        } catch (error){
            console.log(error)
        }
    }

    getProductById = async (id) => {
        try{
            const products = await this.getProducts()
            const product = products.find(item => item.id === id)
            if (!product) return 'producto no encontrado'
            return product
        } catch (error){
            console.log(error)
        }
    }

    #generateId = async() => {
        const products = await this.getProducts()
        return (products.length === 0) ? 1 : (products[products.length-1].id + 1)
    }

    //validacion para el ingreso de un nuevo producto
    #validateAddProduct = async (title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        const asd =[]
        asd.splice
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `[${title}]: tiene campos incompletos`
        } else if (products.find(item => item.code === code)){
            this.#error = `[${title}]: el code ingresado ya existe`
        }
        else this.#error = 'passed'
    }

    //validacion diferente a validateAddProduct, no se puede actualizar a un codigo que lo contenga otro producto
    #validateUpdateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        const product = products.find(item => item.code === code)
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `[${title}]: tiene campos incompletos`
        } else if (product && (product.id !== id)){
            this.#error = `[${title}]: el code ingresado ya existe`
        }
        else this.#error = 'passed'
    }

    addProduct = async(title, description, price, thumbnail, code, stock) => {
        try{
            await this.#validateAddProduct(title, description, price, thumbnail, code, stock)
            if (this.#error === 'passed'){
                const products = await this.getProducts()
                products.push({id: await this.#generateId(), title, description, price, thumbnail, code, stock})
                await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
                console.log(`[${title}]: Producto agregado con éxito`)
            } else
                console.log(this.#error)
        } catch (error){
            console.log(error)
        }
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        await this.#validateUpdateProduct(id, title, description, price, thumbnail, code, stock)
        if (this.#error === 'passed'){
            const products = await this.getProducts()
            const productIndex = products.findIndex(elem => elem.id === id)
            products[productIndex].title = title
            products[productIndex].description = description
            products[productIndex].thumbnail = thumbnail
            products[productIndex].code = code
            products[productIndex].stock = stock
            await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
            console.log(`[${title}]: Producto actualizado con éxito`)
        } else
            console.log(this.#error)
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const productIndex = products.findIndex(elem => elem.id === id)
        if(productIndex !== -1){
            const productDeleted = products.splice(productIndex,1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
            console.log(`[${productDeleted[0].title}]: Producto eliminado con éxito`)
        } else {
            console.log('El producto a eliminar no existe')
        }
    }
}

//Prueba
const productManager = new ProductManager('./products.json')
console.log(await productManager.getProducts())
await productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
await productManager.addProduct('producto prueba 2', 'Este es un producto prueba 2', 300, 'Sin imagen', 'abc156', 35)
console.log(await productManager.getProducts())
console.log(await productManager.getProductById(1))
await productManager.updateProduct(1,'producto prueba actualizado', 'Este es un producto prueba actualizado', 200, 'Sin imagen', 'abc145', 25)
await productManager.deleteProduct(2)