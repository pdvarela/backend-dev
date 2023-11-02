const express = require('express')
const ProductManager = require('./productManager')
const fs = require('fs')
const productManager = new ProductManager("./productsFile.json")
const jsonFile = "./productsFile.json";

if (!fs.existsSync(jsonFile)) {
    productManager.addProduct("botas","Botas negras de cuero",29.30,"urldelaimagen","pp3499",56);      //Agrega un Producto Valido ID 1
    productManager.addProduct("camisa","camisa de lana clase A",29.30,"urldelaimagen1","39995asd",56);   // Agrega un Producto Valido ID 2
    productManager.addProduct("camisa","camisa de lana clase B",10.75,"urldelaimagen2","2435asd",56);   // Agrega un Producto Valido ID 3
    productManager.addProduct("sueter","Sueter de lana clase B",25,"urldelaimagen3","rrr35as",5);       
    productManager.addProduct("casco","casco de ciclismo Mips",33.50,"urldelaimagen4","2445asd",80);    // Genera error Codigo repetido ⛔
    productManager.addProduct("zapato ciclismo","Zapato de ciclismo ZEBRA",90.50,"urldelaimagen5","2935asd",80);
    productManager.addProduct("Mochila MTB","Mochila de hidratacion para MTB",30,"urldelaimagen6","3435kst",40);
    productManager.addProduct("Bicicleta Scott Scale 920","Scott Scale 920 Talla M",2500,"urldelaimagen7","5435asu",12);
    productManager.addProduct("Gel Energetico","Gel Energetico con Cafeina",3.50,"urldelaimagen8","3475ahd",300);
    productManager.addProduct("Saaaaales efervecentes","Sales hidratantes en pastilla",3.80,"urldelaimagen9","7439afd",100);
}

const PORT = 8080

const app = express()


app.get('/products', (req, res) => {
    res.setHeader("Content-type","application/json")
    res.json(productManager.getProducts())
})

app.get('/', (req, res) => {
    res.send('Hello World! Im an Express Server')
})

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})