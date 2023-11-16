const express = require('express');
const {Router} = require('express');
const viewsRouter = Router()

viewsRouter.get('/', (req, res) => {
        
    try {
        const userTest = {
          name: 'Juan',
          age: '25',
        };
        console.log(userTest);
        res.render('index', { userTest });
      } 
      catch (error) {
        console.error('Error al renderizar la pagina Index:', error);
        res.status(500).send('Ocurrio un error al renderizar el index');
      }
    });

    module.exports = viewsRouter;