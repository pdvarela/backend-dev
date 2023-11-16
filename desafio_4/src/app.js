    const express = require('express')
    const path = require('path')
    const fs = require('fs')
    const expHbrs = require('express-handlebars')
    const { Server } = require("socket.io");

    const productsRouter = require('./routes/productsRouter')
    const cartsRouter = require('./routes/cartsRouter')


    const PORT = 8080
    const app = express()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.engine('handlebars', expHbrs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');
   
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);



    //root
    app.get('/', (req, res) => {
        
        try {
            const userTest = {
              name: 'Juan',
              age: '25',
            };
        
            res.setHeader('Content-type', 'text/html');
            res.status(200).render('index', { userTest });
          } 
          catch (error) {
            console.error('Error rendering index page:', error);
            res.status(500).send('An error occurred while rendering the index page');
          }
        });

    const serverHttp = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

    const io = new Server({serverHttp});

    io.on("connection", (socket) => {
      console.log(`Se ha conectado el cliente ${socket.id}`);
    });