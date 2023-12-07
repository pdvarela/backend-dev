import fs from 'fs';
import path from 'path';
import { products } from '../models/products.model.js'


export class ProductManager {

    constructor (filePath){
        this.path = filePath;
    }

    
    async getProducts() {
    // debe devolver el arreglo con todos los productos creados hasta ese momento✅
        
        try {
            const productsList = await products.find({});
            return productsList;
        } catch (error) {
            console.log('Error al obtener los productos de la BD', error);
            return [];
        }
    }

    async addProduct(productObjet) {

        const { title, description, price, thumbnails, code, stock, status, category } = productObjet;

        try {
            const existingProduct = await products.findOne({ code });

            if (existingProduct) {
            throw new Error('No se pudo agregar el producto. ¡El código ingresado ya existe!');
            }

            // Valido los parámetros del producto
            if (
            !title || !description ||  typeof price !== 'number' ||  isNaN(price) ||   (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string')) || !code || typeof stock !== 'number' || isNaN(stock) || typeof status !== 'boolean' || !category
            ) {
            throw new Error('Faltan parámetros en la solicitud o son incorrectos. Verifique los tipos de datos: title:String / description:String / code:String / price:Number / status:Boolean / stock:Number / category:String / thumbnails:Array de mínimo 1 Strings');
            }

            // Crear un nuevo documento con el modelo products
            const newProduct = await products.create({
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
            });

            console.log('PRoducto agregado correctamente a la BD');
        } catch (error) {
            throw new Error('Error al agregar el producto'); error;
        }

    }


    async getProductById(id) {
    // Debe buscar en el arreglo el producto que coincida con el id ✅
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”✅
    // La busqueda la realiza desde MongoDB (Desafio4) ✅ 
    const existingProduct = await products.findOne({ code });

        if( existingProduct ){
            return existingProduct
        }else{
        throw new Error(`El producto con id ${id} no existe en la base de datos`)
        }
    }

    getProductByCode(code) {

            let dataFromFile = this.getProducts()
            
            const found = dataFromFile.find((product) => product.code === code);
    
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