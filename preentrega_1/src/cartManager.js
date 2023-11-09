const { error } = require('console');
const fs = require('fs');
const { re } = require('mathjs');

class CartManager {

  constructor (filePath){
    this.path = filePath;
  }

  getCarts() {
    // debe devolver el arreglo con todos los carts creados hasta ese momento✅

    if (fs.existsSync(this.path)) {
      return JSON.parse(fs.readFileSync(this.path, "utf8"));
    } else {
      return [];
    }
  }

  addCart() {
    // Agregará un cart al arreglo de carts inicial ✅
    // Al agregarlo, debe crearse con un id autoincrementable ✅
    // Agrega el cart actualizando la informacion en memoria y en archivo para asegurar la persistencia de los datos ✅
    let carts = this.getCarts();

    let id = 1;

    if (carts.length > 0) {
      id = carts[carts.length - 1].id + 1;
    }

    let cart = {
      id,
      products: [],
    };

    carts.push(cart);

      fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
    return;
  }

  getProductsInCartByCartId(cid) {
    // Debe devolver el arreglo con todos los productos del cart que coincida con el id ✅
    let carts = this.getCarts();

    let cart = carts.find((cart) => cart.id === cid);

    if (cart) {
      return cart.products;
    }

    return;

  }

  addProductToCartByCartId(cid, pid) {
    // Debe agregar un producto al cart que coincida con el id ✅
    // deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato: product SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo) quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.✅
    // Agrega el producto actualizando la informacion en memoria y en archivo para asegurar la persistencia de los datos en el archivo de carts ✅
    
    let carts = this.getCarts();
    let cart = carts.find((cart) => cart.id === cid);
    let products = cart.products;

    if (cart) {
      let product = products.find((product) => product.id === pid);
      if (product) {
        product.quantity++;
      } else {
        products.push({ id: pid, quantity: 1 });
      }
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
      return;
    } else {
        
        return `Error, no existe el carrito con el ID: ${cid} para agregar el producto con ID: ${pid}`;
    }
  }

}

module.exports = CartManager;