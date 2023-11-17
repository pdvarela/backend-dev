    const express = require('express')
    const path = require('path')
    const fs = require('fs')
    const Server=require('socket.io').Server;
    const exphbs = require('express-handlebars');
    const Handlebars = require('handlebars'); //helper
    const productsRouter = require('./routes/productsRouter')
    const cartsRouter = require('./routes/cartsRouter')
    const viewsRouter = require('./routes/viewsRouter');

    
    const PORT = 8080
    const app = express()
    const hbs = exphbs.create({
      extname: '.hbs', // Extensión de los archivos de plantillas
      defaultLayout: 'main', // Layout predeterminado
      layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio de layouts
      partialsDir: path.join(__dirname, 'views/partials'), // Directorio de partials
      
      
      //Helpers: ToUpperCase para texto en mayuscula en vistas de handlebars. firstThumbnail para pasar a la vista la primera imagen de producto 
      helpers: {
        toUpperCase: function(str) {
          return str.toUpperCase();
        },
        firstThumbnail: function(thumbnails) {
          if (Array.isArray(thumbnails) && thumbnails.length > 0) {
            return thumbnails[0];
          } else {
            return "https://res.cloudinary.com/dm95tqeqt/image/upload/v1700198958/ll6ywuuhk4texahmo6bx.png";
          
          }

        }
      }
  });
  
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views'));
  app.use('/',express.static(path.join(__dirname, '/public')));


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/', viewsRouter);
    

    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

    const io=new Server(server);
    


