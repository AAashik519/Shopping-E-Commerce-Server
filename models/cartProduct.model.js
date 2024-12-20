import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"product"
    },
    qunatity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },


},{
    timestamps:true
})

const CartProductModel = mongoose.model('cartProduct', cartSchema)

export default CartProductModel