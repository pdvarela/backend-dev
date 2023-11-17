const socket = io()
console.log("Cargo ProductsJS");

socket.on("newProduct", datos =>{
    console.log(`Se agrego el producto: ${datos.title}`)
})

socket.on("deletedProduct", datos =>{
    console.log(`Se Elimino el producto: ${datos.title}`)
})