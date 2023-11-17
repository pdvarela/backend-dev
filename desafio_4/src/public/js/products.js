const socket = io()

socket.on("newProduct",(datos) =>{
    console.log(`Se agrego el producto: ${datos.name} con codigo ${datos.code}`)

})
