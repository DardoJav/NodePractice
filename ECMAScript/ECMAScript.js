class ProductManager{

    //Atributos
    #products
    #error

    //Contructor
    constructor() {
        this.#products = []
        this.#error = 'passed'
    }

    //Metodos
    getProducts = () => this.#products

    getProductById = (id) => {
        const product = this.#products.find(item => item.id === id)
        if (!product) return 'producto no encontrado'
        return product
    }

    #generateId = () => {
        return (this.#products.length === 0) ? 1 : this.#products(this.#products.length-1).id + 1
    }

    #validateProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `[${title}]: tiene campos incompletos`
        } else if (this.#products.find(item => item.code === code)){
            this.#error = `[${title}]: el code ingresado ya existe`
        }
        else this.#error = 'passed'
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        this.#validateProduct(title, description, price, thumbnail, code, stock)
        if (this.#error === 'passed')
            this.#products.push({id: this.#generateId(), title, description, price, thumbnail, code, stock})
        else
            console.log(this.#error)
    }
}

//Prueba
const productManager = new ProductManager()
console.log(productManager.getProducts())
productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
console.log(productManager.getProducts())
productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
console.log(productManager.getProductById(1))