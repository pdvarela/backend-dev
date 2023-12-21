    import express  from 'express';
    import mongoose, { mongo } from 'mongoose';
    import path from 'path';
    import __dirname from './utils.js';
    import { Server } from 'socket.io';
    import exphbs from 'express-handlebars';
    import {productsRouter} from './routes/productsRouter.js';
    import {cartsRouter} from './routes/cartsRouter.js';
    import {viewsRouter} from './routes/viewsRouter.js';
    import session from 'express-session';
    import fs from 'fs';
    import Toastify from 'toastify-js'

    
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
    app.use(session({
      secret: 'coderCoder123',
      resave: true,
      saveUninitialized: true,
    }))


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/', viewsRouter);
    
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    export const io = new Server(server);
    
    io.on("connection",socket=>{
      console.log(`Se ha conectado un cliente con id ${socket.id}`)
    })

    try {
        await mongoose.connect('mongodb+srv://petervarela08:AYWGG6tniiXyjTRz@cluster0.q7hvoke.mongodb.net/?retryWrites=true&w=majority',{dbName: 'ecommerce'})
        console.log('DB ONLINE!');
    } catch (error) {
      console.log('Ha ocurrido un error al conectarse a la DB:', error.message);      
    }