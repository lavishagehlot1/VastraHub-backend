import express from 'express';
import { authorization } from '../../middleware/authorization.js';
import { authorize } from '../../middleware/authorizeRole.js';
import uploads from '../../middleware/multer.js';
import { createProduct } from '../../controller/productController.js/productController.js';
const productRouter=express.Router();
productRouter.use(authorization);
productRouter.post('/productCreate',
    authorize('seller'),
    uploads.array('images',5),
    createProduct
);
export default productRouter;
