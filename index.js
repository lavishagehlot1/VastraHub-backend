import app from "./src/app.js";
import dotenv from 'dotenv';
import connectDB from "./src/config/db.config.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
dotenv.config();

//mongodb connection
connectDB();

app.use(globalErrorHandler);

const PORT=3000;
//LIstening to port
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
});