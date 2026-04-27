import express from 'express';
import { authorization } from '../../middleware/authorization.js';
import { authorize } from '../../middleware/authorizeRole.js';
import { createCategory, deleteCategoryById, getAllCategory, getCategoryById, updateCategoryById } from '../../controller/categoryController/categoryController.js';
const categoryRouter = express.Router();

categoryRouter.use(authorization)
categoryRouter.post('/createCategory',
    authorize('admin'),
    createCategory
)
categoryRouter.get('/getAllCategory',
    authorize('admin'),
    getAllCategory
)
categoryRouter.get('/getCategoryById/:id',
    authorize('admin'),
    getCategoryById
)
categoryRouter.put('/updateCategory/:id',
    authorize('admin'),
    updateCategoryById
)
categoryRouter.delete('/deleteCategory/:id',
    authorize('admin'),
    deleteCategoryById
)
export default categoryRouter;