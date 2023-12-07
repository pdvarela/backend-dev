import { Router } from 'express';
export const productsRouter = Router();
import path from 'path';
import __dirname from '../utils.js';
const dirPath = path.join(__dirname,'DB','productsFile.json');
import { ProductManager } from '../dao/managers/productManager.js';
import { io } from '../app.js';
import mongoose from 'mongoose';

//----------------MongoDB

//----------------Fylesystem
const productManager = new ProductManager(dirPath)

//Query limit: Muestra la cantidad de producto limitada por el parametro ✅
productsRouter.get('/', (req, res) => {
    let products = productManager.getProducts()
    if(req.query.limit){
        result = result.slice(0,req.query.limit)
    }
    res.setHeader("Content-type","application/json")
    res.json({products})
})

//By ID con params ✅
productsRouter.get('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    if(isNaN(id)){
        res.send({error:'Ingresa un ID numérico'})
    } else{
        let product = productManager.getProductById(id)
        res.setHeader("Content-type","application/json")
        res.json({product})
    }
    
})

//Mostrar Products ✅
productsRouter.get('/', (req, res) => {
    res.setHeader("Content-type","application/json")
    res.json(productManager.getProducts())
})

// La ruta raíz POST / deberá agregar un nuevo producto✅
productsRouter.post('/', (req, res) => {
    let newProduct = req.body
    //Llamamos al la funcion addProduct de productManager pasandole el newProduct usando try catch para capturar errores en caso de que no se hayan enviado todos los campos del producto (Lo validad productManager.addProduct)
    
    try {
        productManager.addProduct(newProduct)
        // Consigo el producto que acabo de agregar y lo envio a todos los clientes con el evento newProduct con esto mando el producto con el ID correcto y no el que manden por body. ✅
        let lastProduct = productManager.getProductByCode(newProduct.code)
        io.emit('newProduct', lastProduct)
        res.json({ message: 'Producto agregado' });

    }
    catch(error){
        res.status(400).json({ error: error.message });
    }

})

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización. ✅
 productsRouter.put('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    if(isNaN(id)){
       return res.status(400).json({ error: 'Ingresa un ID numérico' });
    }

    let updatedProduct = req.body
    updatedProduct.id = id

    try{
        productManager.updateProduct(id,updatedProduct)
        res.json({ message: 'Producto actualizado' });
        return;
    }
    catch(error){
        res.status(400).json({ error: error.message });
        return;
    }
 })

 //La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. ✅ 
 productsRouter.delete('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    if(isNaN(id)){
        res.status(400).json({ error: 'Ingresa un ID numérico' });
        return;
    }

    try{
        let deletedProduct = productManager.getProductById(id)
        try{
            
            productManager.deletProduct(id)
            io.emit('deletedProduct', deletedProduct)
            res.json({ message: 'Producto eliminado' });
        }
        catch(error){
            res.status(400).json({ error: error.message });
        }

        return;
    }
    catch(error){
        res.status(400).json({ error: error.message });
        return;
    }

 })