import mongoose from "mongoose";

const productsColection= 'products'
const productsSchema= new mongoose.Schema(
    {
        id:{type:Number, required:true},
        title:{type:String, required:true},
        description:{type:String, required:true},
        code:{type: String, unique:true, required:true},
        price:{type:Number, required:true},
        status:{type:Boolean, required:true},
        stock:{type:Number, required:true},
        category:{type:String, required:true},
        thumbnail:{type:[String], required:true},
        deleted:{type:Boolean, default:false}
    },
    {
        timestamps:true,
        strict: true
    }
)

export const productsModel = mongoose.model(productsColection, productsSchema)