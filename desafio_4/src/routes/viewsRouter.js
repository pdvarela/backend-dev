const express = require('express');
const {Router} = require('express');
const viewsRouter = Router()
const ProductManager = require('../productManager')
const path = require('path');
const dirPath = path.join(__dirname, '..','DB','productsFile.json');
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

    });

    module.exports = viewsRouter;

