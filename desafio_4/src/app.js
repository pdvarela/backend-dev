    const express = require('express')
    const path = require('path')
    const fs = require('fs')
    const { Server } = require("socket.io");
    const exphbs = require('express-handlebars');
    const productsRouter = require('./routes/productsRouter')
    const cartsRouter = require('./routes/cartsRouter')
    const viewsRouter = require('./routes/viewsRouter')

    const hbarsPath = path.join(__dirname, 'views')

    const PORT = 8080
    const app = express()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.engine('handlebars', exphbs.engine);
    app.set('view engine', `${hbarsPath}`);
    app.set('views', './src/views');
    
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/', viewsRouter);
    

    const serverHttp = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

    const io = new Server({serverHttp});

    io.on("connection", (socket) => {
      console.log(`Se ha conectado el cliente ${socket.id}`);
    });