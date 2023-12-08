import fs from 'fs';
import path from 'path';
import { products } from '../models/products.model.js'
import { error } from 'console';


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

            // Obtener el último ID para generar el nuevo ID del producto
            const lastProduct = await products.findOne().sort({ id: -1 });
            const id = lastProduct ? lastProduct.id + 1 : 1;

            // Crear un nuevo documento con el modelo products
            const newProduct = await products.create({
            id,
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
        try {
            const existingProduct = await products.findOne({ id });
    
            if( existingProduct ){
                return existingProduct
            }else{
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }
        } catch (error) {
            throw new Error(`Error al buscar al producto ${id} en DB`,error);            
        } 
    }
            
   async getProductByCode(code) {
        try {
            const existingProduct = await products.findOne({ code });

            if( existingProduct ){
                return existingProduct
            }else{
                throw new Error(`El producto con id ${code} no existe en la base de datos`)
            }
        } catch (error) {
            throw new Error(`Error al buscar al producto ${code} en DB`,error);
        }
    }

    async deletProduct(id){
        //ecuentro el producto a eliminar en la base de datos y lo elimino ✅
        try {
            const filter = {id: id}
            const productoToDelet = await products.findOne({filter});
            if(!productoToDelet){
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }
            await products.deleteOne({ id })
            let result = result.count === 1
            ? `Producto con id ${id} eliminado correctamente`
            : `Error al eliminar el producto con id ${id}`
            return result;

        } catch (error) {
            throw new Error(`Error al eliminar el producto con id ${id}`,error);                
        }
    }

   async updateProduct(id, obj){
        const { title,description,price,thumbnails,code,stock,status,category } = obj;
        const filter = {id: id}

        try {
            const productoToDelet = await products.findOne({filter});
            if(!productoToDelet) {
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }else{

                let result = await products.updateOne(filter, { $set: obj })
                result = result.modifiedCount === 1
                ? `Producto con ID ${id} fue actualizado correctamente`
                : `Error, no se pudo realizar la actualización del producto con ID ${id}`
                return result;
            }
            
        } catch (error) {
            throw new Error(`Error al actualizar el producto con ID ${id}`,error);
        }


        // if(index===-1){
        //     throw new Error(`El producto con id ${id} no existe en la base de datos`)
        // } else if(!title || !description || typeof price !== 'number' || isNaN(price) || (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string')) || !code || typeof stock !== 'number' || isNaN(stock) || typeof status !== 'boolean' || !category) {
        //     throw new Error('Faltan parámetros en la solicitud o son incorrectos. Verifique los tipos de datos: title:String / description:String / code:String / price:Number / status:Boolean / stock:Number / category:String / thumbnails:Array de minimo 1 Strings');
            
        // }
    }
}