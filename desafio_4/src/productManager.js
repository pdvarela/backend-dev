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

    addProduct(productObjet) {
        const { title,description,price,thumbnails,code,stock,status,category } = productObjet;
        let products = this.getProducts();
        
        if(products.some(product => product.code === code)){
            throw new Error('No se pudo agregar el producto! El código ingresado ya existe');
            return;
            
        } else if(!title || !description || typeof price !== 'number' || isNaN(price) || (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string')) || !code || typeof stock !== 'number' || isNaN(stock) || typeof status !== 'boolean' || !category) {
            throw new Error('Faltan parámetros en la solicitud o son incorrectos. Verifique los tipos de datos: title:String / description:String / code:String / price:Number / status:Boolean / stock:Number / category:String / thumbnails:Array de minimo 1 Strings');
            
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
                thumbnails,
                code,
                stock,
                status,
                category,
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
        return "Product not found "
        }
    }

    deletProduct(id){
        let products=this.getProducts()
        let index=products.findIndex(product=>product.id===id)
        if(index===-1){
            throw new Error(`El producto con id ${id} no existe en la base de datos`)
        }

        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
    }

    updateProduct(id, obj){
        const { title,description,price,thumbnails,code,stock,status,category } = obj;
        let products=this.getProducts()
        let index=products.findIndex(product=>product.id===id)
        if(index===-1){
            throw new Error(`El producto con id ${id} no existe en la base de datos`)
        } else if(!title || !description || typeof price !== 'number' || isNaN(price) || (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string')) || !code || typeof stock !== 'number' || isNaN(stock) || typeof status !== 'boolean' || !category) {
            throw new Error('Faltan parámetros en la solicitud o son incorrectos. Verifique los tipos de datos: title:String / description:String / code:String / price:Number / status:Boolean / stock:Number / category:String / thumbnails:Array de minimo 1 Strings');
            
        }
        
        products[index]={
            ...products[index],
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
            id
        }

        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))

    }

}

module.exports = ProductManager;