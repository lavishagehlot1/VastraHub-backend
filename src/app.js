import express from 'express';
import authRoute from '../src/routes/authRoute.js'
import passport from '../src/config/passport.js'
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import otpRoute from '../src/routes/otpRoute.js/otpRoute.js';
import sellerRoute from '../src/routes/sellerRoute/sellerRoute.js';
import productRouter from './routes/productRoute/productRoute.js';
import categoryRouter from './routes/categoryRoute/categoryRoute.js';
import path from 'path';
const app=express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), "public")));

app.use('/api/auth',authRoute);
app.use('/api/otp',otpRoute);
app.use('/api/seller',sellerRoute);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
//app.use(passport.initialize()); // required for all Passport strategies


app.use(globalErrorHandler)
////swagger UI route

export default app;