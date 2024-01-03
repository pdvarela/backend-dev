import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsColection= 'carts'
const cartsSchema= new mongoose.Schema(
    {
        products:{
            type:[
                { 
                    productId:{ 
                        type:mongoose.Schema.Types.ObjectId, 
                        ref:'products', 
                        default: [],
                    }, 
                    quantity:Number,
                },
            ],
        },
        deleted:{
            type:Boolean,
            default:false,
        },
    },
        
    { timestamps: true, strict: true, }
);

//Codigo de los pre + lean
cartsSchema.pre('find', function(){
    this.populate(
        {path:'products.productId',}
    ).lean();
});

cartsSchema.pre('findOne', function(){
    this.populate(
        {path:'products.productId',}
    ).lean();
});

cartsSchema.plugin(mongoosePaginate);
export const cartsModel = mongoose.model(cartsColection,cartsSchema)