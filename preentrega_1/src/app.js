    const express = require('express')
    const fs = require('fs')

    const productsRouter = require('./routes/productsRouter')
    const cartsRouter = require('./routes/cartsRouter')

    const PORT = 8080
    const app = express()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
   
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);



    //root
    app.get('/', (req, res) => {
        res.send('Hello World! Im an Express Server - Root For ProductManager')
    })

    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })