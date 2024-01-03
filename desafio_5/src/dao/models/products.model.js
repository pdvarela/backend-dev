import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsColection= 'products'
const productsSchema= new mongoose.Schema(
    {
        title:{type:String, required:true},
        description:{type:String, required:true},
        code:{type: String, unique:true, required:true},
        price:{type:Number, required:true},
        status:{type:Boolean, required:true},
        stock:{type:Number, required:true},
        category:{type:String, required:true},
        thumbnails:{type:[String], required:true},
        deleted:{type:Boolean, default:false}
    },
    {
        timestamps:true,
        strict: true
    }
)

productsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsColection, productsSchema)