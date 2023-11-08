const express = require('express')
const ProductManager = require('./productManager')
const CartManager = require('./cartManager')
const fs = require('fs')
const productManager = new ProductManager("./DB/productsFile.json")
const cartManager = new CartManager("./DB/cartsFile.json")
const jsonFile = productManager.path;
const jsonCartsFile = cartManager.path;

//La siguiente validacion permite agregar los productos y generar el archivo de productos para las respectivas pruebas sin dejar un archivo ya creado en el sistema de archivos
if (!fs.existsSync(jsonFile)) {
    productManager.addProduct("botas","Botas negras de cuero",29.30,['url1','url2','url3'],"pp3499",56);
    productManager.addProduct("camisa","camisa de lana clase A",29.30,['url1','url2','url3'],"39995asd",56);   
    productManager.addProduct("camisa","camisa de lana clase B",10.75,['url1','url2','url3'],"2435asd",56);   
    productManager.addProduct("sueter","Sueter de lana clase B",25,['url1','url2','url3'],"rrr35as",5);       
    productManager.addProduct("casco","casco de ciclismo Mips",33.50,['url1','url2','url3'],"2445asd",80);    
    productManager.addProduct("zapato ciclismo","Zapato de ciclismo ZEBRA",90.50,['url1','url2','url3'],"2935asd",80);
    productManager.addProduct("Mochila MTB","Mochila de hidratacion para MTB",30,['url1','url2','url3'],"3435kst",40);
    productManager.addProduct("Bicicleta Scott Scale 920","Scott Scale 920 Talla M",2500,['url1','url2','url3'],"5435asu",12);
    productManager.addProduct("Gel Energetico","Gel Energetico con Cafeina",3.50,['url1','url2','url3'],"3475ahd",300);
    productManager.addProduct("Sales efervescentes","Sales hidratantes en pastilla",3.80,['url1','url2','url3'],"7439afd",100);
}

//Verificamos si existe el archivo de carritos para agregar los carritos vacios y simular un arreglo de carritos en persistencia de FS
if (!fs.existsSync(jsonCartsFile)) {
    cartManager.addCart();
    cartManager.addCart();
    cartManager.addCart();
    cartManager.addCart();
    cartManager.addCart();
}

const PORT = 8080

const app = express()

//Query limit
app.get('/products', (req, res) => {
    let result = productManager.getProducts()
    if(req.query.limit){
        result = result.slice(0,req.query.limit)
    }
    res.setHeader("Content-type","application/json")
    res.json({result})
})

//By ID con params
app.get('/products/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    if(isNaN(id)){
        res.send({error:'Ingresa un ID numérico'})
    } else{
        result = productManager.getProductById(id)
        res.setHeader("Content-type","application/json")
        res.json({result})
    }
    
})

//Mostrar Products
app.get('/products', (req, res) => {
    res.setHeader("Content-type","application/json")
    res.json(productManager.getProducts())
})

//root
app.get('/', (req, res) => {
    res.send('Hello World! Im an Express Server - Root For ProductManager')
})

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})