import express from 'express';
import { authorization } from '../../middleware/authorization.js';
import { applySeller, sellerProfile } from '../../controller/sellerController/sellerController.js';
import { authorize } from '../../middleware/authorizeRole.js';
const sellerRoute=express.Router();

sellerRoute.use(authorization);
sellerRoute.post('/applySeller',
    authorize('user'),
    applySeller
);

sellerRoute.post('/sellerProfile',
    authorize('user'),
    sellerProfile
)
export default sellerRoute;