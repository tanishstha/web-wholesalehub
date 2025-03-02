import express from 'express';
import {createProductController,getProductController,getSingleProduct,productPhotoController,productPhotoController1,deleteProductController,updateProductController, productFiltersController, productCountController, productListController, searchProductController, realtedProductController, productCategoryController} from '../controllers/productController.js';
import formidable from 'express-formidable';
import { get } from 'mongoose';
import productModel from '../models/productModel.js';

const router = express.Router();




//routes
router.post('/create-product',formidable(),createProductController)

//get products
router.get('/get-product',getProductController)

//single product
router.get('/get-product/:slug',getSingleProduct)

//get phoot
router.get("/product-photo/:pid", productPhotoController);

router.get("/product-photo1/:pid", productPhotoController1);


//delete
router.delete('/delete-product/:pid',deleteProductController)

//update
router.put('/update-product/:pid',formidable(),updateProductController)

//filter products
router.post('/product-filters',productFiltersController)

//product count
router.get('/product-count',productCountController)

//product config
router.get('/product-list:page',productListController)

//search product
router.get("/search/:keyword", searchProductController);

//similar products
router.get('/related-product/:pid/:cid',realtedProductController)

//category wise
router.get('/product-category/:slug',productCategoryController)

//payment
//token

//payments


router.get('/mens', async (req, res) => {
  try {
    const products = await productModel.find({ slug: { $regex: 'mens', $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/womens', async (req, res) => {
  try {
    const products = await productModel.find({ slug: { $regex: 'womens', $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;