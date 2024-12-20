import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()                      



if(!process.env.MONGODB_URI){
    throw new Error("Please provide mongodb uri in the .env file")
}

const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB Connect Successfully');
        
    } catch (error) {
        console.log("MOngoDB connection error",error.message);
        // process.exit(1)
    }
}

export default connectDB