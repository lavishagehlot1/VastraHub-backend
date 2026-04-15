import dotenv from 'dotenv';
dotenv.config(); 

// console.log("ENV CHECK HOST:", process.env.SMTP_HOST);
// console.log("ENV CHECK PORT:", process.env.SMTP_PORT);
// console.log("ENV CHECK USER:", process.env.SMTP_USER);


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