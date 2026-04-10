import dotenv from 'dotenv';
dotenv.config(); 


import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";
// import path from 'path';


//mongodb connection
connectDB();
// Serve static files from "public"
// app.use(express.static(path.join(process.cwd(), "public")));


const PORT=3000;
//LIstening to port
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
});