const fs = require('fs');

class ProductManager {

    constructor (filePath){
        this.path = filePath
    }

    
    getProducts() {
    // debe devolver el arreglo con todos los productos creados hasta ese momento✅

        if(fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path, "utf8"));
        } else {
            return [];
        }
        

    }

    addProduct(title,description,price,thumbnail,code,stock) {
        // Agregará un producto al arreglo de productos inicial ✅
        // Validar que no se repita el campo “code” y que todos los campos sean obligatorios✅
        // Al agregarlo, debe crearse con un id autoincrementable ✅
        // Agrega el producto actualizando la informacion en memoria y en archivo para asegurar la persistencia de los datos (Desafio2) ✅
        let products = this.getProducts();

        if(products.some(product => product.code === code)){
            console.log("\n ⛔ ¡No se pudo agregar el producto! El código ingresado ya existe \n");
            return;
            
        } else if(!title || !description || !price || !thumbnail || !code || !stock) {
            
            console.log("\n ⚠️  Todos los campos son obligatorios ¡Intenta agregar nuevamente el producto! \n");
            return;
            
        } else {
            let id = 1;
            
            if (products.length > 0){
                id = products[products.length-1].id + 1;
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

            products.push(product);

            try {
                fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
            } catch (error) {
                console.log("Error al tratar de escribir el archivo", error);
            }

            return;
        }
    }


    getProductById(id) {
    // Debe buscar en el arreglo el producto que coincida con el id ✅
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”✅
    // La busqueda la realiza desde los datos del archivo de persistencia (Desafio2) ✅ 
        let dataFromFile = this.getProducts()
        
        const found = dataFromFile.find((product) => product.id === id);

        if( found ){
            return found
        }else{
        return " ❌ Product not found "
        }
    }

    deletProduct(id){
        let products=this.getProducts()
        let index=products.findIndex(product=>product.id===id)
        if(index===-1){
            console.log(`El producto con id ${id} no existe en la base de datos`)
            return 
        }

        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))

    }

    updateProduct(id, obj){
        let products=this.getProducts()
        let index=products.findIndex(product=>product.id===id)
        if(index===-1){
            console.log(`El producto con id ${id} no existe en la base de datos`)
            return 
        }

        products[index]={
            ...productos[index],
            ...obj,
            id
        }

        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))

    }



}



//Validaciones
//let productManager = new ProductManager("./productsFile.json")                //Instancia de la clase ProductManager
//console.log(productManager.getProducts());               //Arreglo producto vacio


module.exports = ProductManager;