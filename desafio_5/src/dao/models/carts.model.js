import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsColection= 'carts'
const cartsSchema= new mongoose.Schema(
    {
        id:{type:Number, required:true, unique:true},
        productId:[{ type:mongoose.Schema.Types.ObjectId, ref:'products', default: [] }],
        deleted:{type:Boolean, default:false}
    },
    {
        timestamps:true,
        strict: true
    }
)

cartsSchema.plugin(mongoosePaginate);
export const cartsModel = mongoose.model(cartsColection,cartsSchema)