import express from 'express';
import {createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController} from '../controllers/categoryController.js'

const router = express.Router();


//routes

//create category
router.post('/create-category', createCategoryController)

router.put('/update-category/:id', updateCategoryController);

router.get('/get-category',categoryController);

//single category
router.get('/single-category/:slug',singleCategoryController);

//delete category
router.delete('/delete-category/:id',deleteCategoryController)

export default router;
