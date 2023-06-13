const socket = io()

socket.on('products', async(data) => {
    const productList = document.getElementById('messagesLogs')
    let products = ''
    data.forEach(product => {
        products += `<hr /> <b> Titulo: </b>${product.title} <br /> 
                     <b> Descripcion: </b>${product.description} <br />
                     <b> Codigo: </b>${product.code} <br />
                     <b> Precio: </b>${product.price} <br />
                     <b> Cantidad: </b>${product.stock} <br />
                     <b> Categoria: </b>${product.category} <br />`
    })
    productList.innerHTML = products
})