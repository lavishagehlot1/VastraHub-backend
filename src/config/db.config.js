import mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL||3000);
        console.log("MongoDB is connected sucessfully")
    }catch(err){
        console.log("MongoDB error:",err.name,err.message);
        process.exit(1);
    }
}
export default connectDB;