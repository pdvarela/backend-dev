import fs from 'fs';
import path from 'path';
import { productsModel as products } from '../models/products.model.js'
import { error } from 'console';


export class ProductManager {

    constructor (filePath){
        this.path = filePath;
    }

    
    async getProducts({ limit, page, sortByPrice, category, availability }) {
        try {
            const filter = {};

            // Filtrar por categoría si se especifica
            if (category) {
                filter.category = category;
            }

            // Filtrar por disponibilidad si se especifica
            if (availability) {
                filter.status = availability === 'available' ? true : false;
            }

            const sort = {};

            // Ordenar por precio si se especifica 
            if (sortByPrice) {
                sort.price = sortByPrice === 'asc' ? 1 : -1;
            }

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort,
                lean: true,
            };

            const productsList = await products.paginate(filter, options);
            return productsList;
        } catch (error) {
            console.log('Error al obtener los productos de la BD', error);
            return [];
        }
    }

    async addProduct(productObjet) {

        const { title, description, price, thumbnails, code, stock, status, category } = productObjet;
        const filter = { code: code };
        try {
            const existingProduct = await products.findOne(filter);

            if (existingProduct!==null) {
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

            let res = `Producto agregado correctamente a la BD`
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async getProductById(id) {
    // Debe buscar en el arreglo el producto que coincida con el id ✅
    // En caso de no coincidir ningún id, mostrar en consola un error “Not found”✅
    // La busqueda la realiza desde MongoDB (Desafio4) ✅
        const filter = {id: id}
        try {
            const existingProduct = await products.findOne(filter);
    
            if( existingProduct !== null ){
                return existingProduct
            }else{
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }
        } catch (error) {
            throw new Error(error.message);            
        } 
    }
            
    async getProductByCode(code) {
    const filter = {code: code}
        try {
            const existingProduct = await products.findOne(filter);

            if( existingProduct !== null){
                return existingProduct
            }else{
                throw new Error(`El producto con codigo ${code} no existe en la base de datos`)
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deletProduct(id){
        //ecuentro el producto a eliminar en la base de datos y lo elimino ✅
        try {
            const filter = {id: id}
            const productToDelet = await products.findOne(filter);
            if(productToDelet===null){
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }
            let result = await products.deleteOne(filter)
            result = result.deletedCount === 1
            ? `Producto con id ${id} eliminado correctamente`
            : `Error al eliminar el producto con id ${id}`
            return result;

        } catch (error) {
            throw new Error(error.message);                
        }
    }

    async updateProduct(id, obj){
        const { title,description,price,thumbnails,code,stock,status,category } = obj;
        const filter = {id: id}

        try {
            const productoToDelet = await products.findOne(filter);
            if(!productoToDelet) {
                throw new Error(`El producto con id ${id} no existe en la base de datos`)
            }else if(!title || !description || typeof price !== 'number' || isNaN(price) || (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string')) || !code || typeof stock !== 'number' || isNaN(stock) || typeof status !== 'boolean' || !category){
                throw new Error('Faltan parámetros en la solicitud o son incorrectos. Verifique los tipos de datos: title:String / description:String / code:String / price:Number / status:Boolean / stock:Number / category:String / thumbnails:Array de minimo 1 Strings');
            } else{                
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