import app from "./src/app.js";
import dotenv from 'dotenv';
import connectDB from "./src/config/db.config.js";
dotenv.config();

//mongodb connection
connectDB();

const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
});