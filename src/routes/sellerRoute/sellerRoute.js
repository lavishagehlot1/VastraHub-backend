import express from 'express';
import { authorization } from '../../middleware/authorization.js';
import { applySeller, approveSeller, rejectSeller, sellerProfile, submitForReview } from '../../controller/sellerController/sellerController.js';
import { authorize } from '../../middleware/authorizeRole.js';
import { validation } from '../../middleware/validations.js';
import { sellerProfileSchema } from '../../validations/sellerValidation.js';
import { seller } from '../../model/seller/sellerModel.js';
const sellerRoute=express.Router();

sellerRoute.use(authorization);
sellerRoute.post('/applySeller',
    authorize('user'),
    applySeller
);

sellerRoute.post('/sellerProfile',
  validation({body:sellerProfileSchema}),  
    authorize('user'),
    sellerProfile
)

sellerRoute.post('/submitForReview',
    validation({body:sellerProfileSchema}),
    authorize('user'),
    submitForReview
);

sellerRoute.post('/approveSeller/:id',
    authorize('admin'),
    approveSeller
)

sellerRoute.post('/rejectSeller/:id',
    authorize('admin'),
    rejectSeller
)
export default sellerRoute; 