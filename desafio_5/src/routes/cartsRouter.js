import { Router } from "express";
export const cartsRouter = Router()
import path from 'path'
import __dirname from "../utils.js";
const dirPath = path.join(__dirname,'DB','cartsFile.json');
import { CartManager } from "../dao/managers/cartManager.js";
const cartManager = new CartManager(dirPath)

//La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura: ✅
//Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
//products: Array que contendrá objetos que representen cada producto
cartsRouter.post('/', async(req, res) => {
    let {products} = req.body;
    try {
        if(!products){
            products = [];
            let result = await cartManager.addCart(products);
            res.status(200).json({payload: result});
        }
    
        let result = await cartManager.addCart(products);
        res.json({result});
        
    } catch (error) {
        throw new Error("Error al tratar de agregar el carrito a la DB", error);
    }

})

//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.✅
cartsRouter.get('/:cid', async(req, res) => {
    let cid = parseInt(req.params.cid);
    
    if (isNaN(cid)) {
        res.status(400).json({ error: 'El id debe ser un número' });
        return;
    }
    try{
        let productsInCart = cartManager.getProductsInCartByCartId(cid);
        res.setHeader("Content-type","application/json")
        res.json({productsInCart})

    }
    catch(error){
        res.status(400).json({ error: error.message });
        return;

    }
})

//La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
//product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
//quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
//Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
// Adicional no se agrega el producto y se responde error si no existe el producto o el archivo de productos✅

cartsRouter.post('/:cid/product/:pid', async(req, res) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    //veryfico req.body para ver si mandaron la cantidad de producto a actualizar
    let {quantity} = req.body;
    
    if (isNaN(cid) || isNaN(pid)) {
        res.status(400).json({ error: 'El id debe ser un número' });
        return;
    }
    if(isNaN(quantity) || quantity < 1){
        res.status(400).json({ error: 'La cantidad debe ser un número mayor o igual a 1' });
    }
    if(!quantity || quantity === null || quantity ===undefined ){
        quantity = 1;
    }

    try{
        cartManager.addProductToCartByCartId(cid, pid, quantity);
        res.json({ message: `${quantity} Producto: ${pid}  agregado con exito` });
    }
    catch(error){
        res.status(400).json({ error: error.message });
        return;

    }

})