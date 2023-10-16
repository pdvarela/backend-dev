
class ProductManager {

    constructor (product){
        this.products = []
    }

    addProduct(title,description,price,thumbnail,code,stock) {
    // Agregará un producto al arreglo de productos inicial ✅
    // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    // Al agregarlo, debe crearse con un id autoincrementable ✅

        let id = 1;

        if (this.products.length > 0){
            id = this.products[this.products.length-1].id + 1;
        }

        let product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(product);
    }

    getProducts() {
    // debe devolver el arreglo con todos los productos creados hasta ese momento✅

        return this.products

    }

    getProductById(id) {
    // Debe buscar en el arreglo el producto que coincida con el id ✅
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”✅

        const found = this.products.find((product) => product.id === id);

       if( found ){
        return found
       }else{
       return " \n Not found"
       }
    }
}

let productManager = new ProductManager()
productManager.addProduct("botas","Botas negras de cuero",29.30,"urldelaimagen","2435asd",56);
productManager.addProduct("sueter","Sueter de lana clase B",59.00,"urldelaimagen2","2435asd",5);
console.log(productManager.getProducts());
console.log(productManager.getProductById(2));