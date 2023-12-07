import { Router } from 'express';
export const viewsRouter = Router()
import { ProductManager } from '../dao/managers/productManager.js';
import path from 'path';
import __dirname from '../utils.js';
import { io } from '../app.js';
const dirPath = path.join(__dirname,'DB','productsFile.json');
const productManager = new ProductManager(dirPath)


viewsRouter.get('/', (req, res) => {
   
  try {
      
    let products = productManager.getProducts();
      
      let title = "LISTA DE PRODUCTOS";
      let inventoryLenght = products.length;
      res.status(200).render('index', { products, title, inventoryLenght});
    } 
    catch (error) {
      console.error('Error al renderizar la pagina Index:', error);
      res.status(500).send('Ocurrio un error al renderizar el index');
    }
  });

viewsRouter.get('/realTimeProducts', (req, res) => {
  try {
        
    let products = productManager.getProducts();
      
      let title = "LISTA DE PRODUCTOS";
      let inventoryLenght = products.length;
      res.status(200).render('realTimeProducts', { products, title, inventoryLenght});
    } 
    catch (error) {
      console.error('Error al renderizar la pagina Index:', error);
      res.status(500).send('Ocurrio un error al renderizar el index');
    }
});

//Agrego post y delete en caso que se requiera usar estos endpoints desde viewsRouter directamente

viewsRouter.post('/', (req, res) => {
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

viewsRouter.delete('/:pid', (req, res) => {
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


