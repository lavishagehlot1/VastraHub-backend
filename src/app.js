import express from 'express';
import authRoute from '../src/routes/authRoute.js'
const app=express();
app.use(express.json());

app.use('/api/auth',authRoute)

////swagger UI route

export default app;