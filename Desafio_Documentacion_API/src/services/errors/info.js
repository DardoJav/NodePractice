export const generateProductErrorInfo = product => {
    return `
    Uno o mas parámetros para crear el producto estan incompletos o no son válidos.
    Lista de properties obligotorios:
        - title: Must be a string. (${product.title})
        - description: Must be a string. (${product.description})
        - code: Must be a string. (${product.code})
        - category: Must be a string. (${product.category})
        - stock: Must be a string. (${product.stock})
        - price: Must be a number. (${product.price})
    `
}