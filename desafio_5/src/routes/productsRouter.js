import { Router } from 'express';
export const productsRouter = Router();
import path from 'path';
import __dirname from '../utils.js';
const dirPath = path.join(__dirname,'DB','productsFile.json');
import { ProductManager } from '../dao/managers/productManagerMongoDB.js';
import { io } from '../app.js';
import mongoose from 'mongoose';


const productManager = new ProductManager(dirPath)


//Query limit: Muestra la cantidad de producto limitada por el parametro ✅
productsRouter.get('/', async (req, res) => {
    console.log('----------Entro al endpoint');
    try {
        console.log('----------Entro TRY');
        const { limit = 10, page = 1, sortByPrice, query} = req.query || {};
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const category = query;

         for (const key in req.query) {
             if (req.query.hasOwnProperty(key)) {
                 console.log(`${key}: ${req.query[key]} ----`);
             }
         }

        if (isNaN(parsedLimit) || isNaN(parsedPage)) {
            return res.status(400).json({ message: 'Los valores de limit y page deben ser números válidos.' });
        }

        // Verificar si no se proporcionan filtros ni consultas, devolver todos los productos
        if (Object.keys(req.query).length === 0) {
            const products = await productManager.getProducts({});
            return res.json(products);
        }

        const products = await productManager.getProducts({ limit: parsedLimit, page: parsedPage, sortByPrice, category });
        //  return res.status(200).json({
        //      status:'success',
        //      payload:products.docs, 
        //      totalPages:products.totalPages, 
        //      prevPage: products.prevPage, 
        //      nextPage: products.nextPage, 
        //      page:products.page,
        //      hasPrevPage:products.hasPrevPage, 
        //      hasNextPage:products.hasNextPage, 
        //      prevLink: products.prevLink, 
        //      nextLink: products.nextLink,
        //      totalDocs:products.totalDocs, 

        //  });
        
        //Renderizar en HB
         const title = "LISTA DE PRODUCTOS";
         const inventoryLength = products.totalDocs; // Cambiar a la propiedad correcta de total de documentos
         console.log(`@@@@@ INVENTORY: ${inventoryLength}`);
         res.status(200).render('index', { products: products.docs, title, inventoryLength});
         
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
});

//By ID con params ✅
productsRouter.get('/:pid', async(req, res) => {
    let id = req.params.pid
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'El _id proporcionado no es válido' });
    } else{
        let product = await productManager.getProductById(id)
        res.setHeader("Content-type","application/json")
        res.json({product})
    }
    
})

//Mostrar Products ✅
productsRouter.get('/', async(req, res) => {
    res.setHeader("Content-type","application/json")
    res.json(await productManager.getProducts())
})

// La ruta raíz POST / deberá agregar un nuevo producto✅
productsRouter.post('/', async(req, res) => {
    let newProduct = req.body
    //Llamamos al la funcion addProduct de productManager pasandole el newProduct usando try catch para capturar errores en caso de que no se hayan enviado todos los campos del producto (Lo validad productManager.addProduct)
    
    try {
        await productManager.addProduct(newProduct)
        // Consigo el producto que acabo de agregar y lo envio a todos los clientes con el evento newProduct con esto mando el producto con el ID correcto y no el que manden por body. ✅
        let lastProduct = await productManager.getProductByCode(newProduct.code)
        const {_id, name}=lastProduct
        io.emit('newProduct', lastProduct)
        res.json({ message: 'Producto agregado con exito: ', _id: _id, name:name});

    }
    catch(error){
        res.status(400).json({ error: error.message });
    }

})

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización. ✅
 productsRouter.put('/:pid', async(req, res) => {
    let id = req.params.pid
    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'El _id proporcionado no es válido' });
    }
 
    let updatedProduct = req.body
    delete updatedProduct._id;

    try{
        await productManager.updateProduct(id,updatedProduct)
        res.json({ message: 'Producto actualizado' });
        return;
    }
    catch(error){
        res.status(400).json({ error: error.message });
        return;
    }
 })

 //La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. ✅ 
 productsRouter.delete('/:pid', async(req, res) => {
    let id = req.params.pid
    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'El _id proporcionado no es válido' });
    }

    try{
        let deletedProduct = await productManager.getProductById(id)
        try{
 
            let deletResult = await productManager.deletProduct(id)
            io.emit('deletedProduct', deletedProduct)
            res.json({ message: deletResult});
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