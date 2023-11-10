const express = require('express');
const {Router} = require('express');
const cartsRouter = Router()
const path = require('path')
const dirPath = path.join(__dirname, '..','DB','cartsFile.json');
const CartManager = require('../cartManager')
const cartManager = new CartManager(dirPath)
//La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura: ✅
//Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
//products: Array que contendrá objetos que representen cada producto


cartsRouter.post('/', (req, res) => {
    let newCart = cartManager.addCart();
    res.json({ newCart });

})

//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.✅

cartsRouter.get('/:cid', (req, res) => {
    let cid = parseInt(req.params.cid);
    if (isNaN(cid)) {
        res.status(400).json({ error: 'El id debe ser un número' });
        return;
    }

    let productsInCart = CartManager.getCart(cid);
    res.setHeader("Content-type","application/json")
    res.json({productsInCart})
})

//La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
//product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
//quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
//Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. ✅

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        res.status(400).json({ error: 'El id debe ser un número' });
        return;
    }

    CartManager.addProductToCartByCartId(cid, pid);
    res.json({ message: 'Producto agregado' });

})


module.exports = cartsRouter