import path from 'path';
import __dirname from '../../utils.js';
const productsPath = path.join(__dirname, '.','DB','productsFile.json')
import { cartsModel } from '../models/carts.model.js';
import { ProductManager } from './productManagerMongoDB.js';

export class CartManager {


  async getCarts() {
    // debe devolver el arreglo con todos los carts creados hasta ese momento✅
    try {
        const filter = {deleted: false};
        const carts = await cartsModel.find(filter).lean();
        return carts;
    } catch (error) {
        throw new Error("Error al tratar de leer la BD de carts", error);
    }    
  }

  async addCart(products=[]) {
    // Agregará un cart a la BD con o sin productos segun venga products del endpoint ✅
    
    try{
      return await cartsModel.create({products})
    }
    catch(error){
        throw new Error("Error al tratar de agregar el carrito a la DB", error);
    }
  }

  async getProductsInCartByCartId(cid) {
    // Debe devolver el arreglo con todos los productos del cart que coincida con el id ✅
    try {
      const filter = {deleted: false, _id: cid};
      return await cartsModel.findOne(filter);  
    } catch (error) {
      throw new Error("Error al tratar de encontrar el carrito en la BD de carts", error);
    }
  }

  async addProductToCartByCartId(cid, pid, quantity=1) {
    // Debe agregar un producto al cart que coincida con el id ✅
    //actualizo el carro segun su id, le actualizo el arreglo de productos agregando un nuevo objeto con el id del producto que me llega y la cantidad en +1
    
    try {
      const cart = await this.getProductsInCartByCartId(cid);
      if (cart = null) {
        return "No existe el carrito con ese ID";
      } else {
        const productToAdd = {productId: pid, quantity: quantity};
        const existingProduct = cart.products.find(product => product.productId.toString() === pid );
        if (existingProduct) {
              if (quantity>=1){
                existingProduct.quantity++;
              }
              existingProduct.quantity = existingProduct.quantity + quantity;
        } else {
          cart.products.push(productToAdd);
        }
        await cart.save();
        //retorno un mensaje de que se agrego el producto al carrito
        return;
      }

    } catch (error) {
      throw new Error("Error al tratar de agregar el producto al carrito", error);
    }

  }

}

