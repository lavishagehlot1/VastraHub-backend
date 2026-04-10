import express from 'express';
import authRoute from '../src/routes/authRoute.js'
import passport from '../src/config/passport.js'
import globalErrorHandler from './middleware/globalErrorHandler.js';
import path from 'path';
const app=express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use('/api/auth',authRoute);
app.use(passport.initialize()); // required for all Passport strategies


app.use(globalErrorHandler)
////swagger UI route

export default app;