    const express = require('express')
    const path = require('path')
    const fs = require('fs')
    const { Server } = require("socket.io");
    const exphbs = require('express-handlebars');
    const productsRouter = require('./routes/productsRouter')
    const cartsRouter = require('./routes/cartsRouter')
    const viewsRouter = require('./routes/viewsRouter')


    const PORT = 8080
    const app = express()
    const hbs = exphbs.create({
      extname: '.hbs', // Extensión de los archivos de plantillas
      defaultLayout: 'main', // Layout predeterminado
      layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
      partialsDir: path.join(__dirname, 'views/partials'), // Directorio de partials
  });
  
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views'));


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    
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