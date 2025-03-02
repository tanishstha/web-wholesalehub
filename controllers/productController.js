import productModel from '../models/productModel.js'
import fs from 'fs';
import slugify from 'slugify'
import dotenv from 'dotenv';

dotenv.config()


export const createProductController = async (req, res) => {
  try {
    const { name, description, slug, price, category, quantity, shipping, photo, photo1, photo2, colors } = req.fields;

    // Validation
    if (!name) return res.status(500).send({ error: "Name is required" });
    if (!description) return res.status(500).send({ error: "Description is required" });
    if (!price) return res.status(500).send({ error: "Price is required" });
    if (!category) return res.status(500).send({ error: "Category is required" });
    if (!quantity) return res.status(500).send({ error: "Quantity is required" });
    if (!photo || !photo1 || !photo2) return res.status(500).send({ error: "All photo URLs are required" });

    // Parse the colors field
    let colorsArray = [];
    try {
      colorsArray = JSON.parse(colors);
    } catch (error) {
      return res.status(500).send({ error: "Invalid colors format" });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
      photo,
      photo1,
      photo2,
      colors: colorsArray,  // Correctly set the colors array
    });

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};
export const getProductController = async(req,res) =>{
    try{
        const products = await  productModel.find({}).populate('category').sort({createdAt:1})
        res.status(200).send({
            success: true,
            total_count: products.length,
            message: "All products",
            products,
        })

    }catch(error){
        console.log(error),
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message,
        })
    }
}

//get single product
export const getSingleProduct = async(req,res) =>{
    try{
        const product = await productModel.findOne({slug:req.params.slug}).populate('category')
        res.status(200).send({
            success: true,
            message: "Single Product fetched",
            product,
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting single product"
        })
    }
}
//m
export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await productModel.findById(pid).select("photo");
    console.log("Product fetched:", product);
    if (product && product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

export const productPhotoController1 = async (req, res) => {
  try {
      const { pid } = req.params;
      
      // Validate ObjectId format
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).send({
              success: false,
              message: "Invalid product ID format",
          });
      }

      const product = await productModel.findById(pid).select("photo1");
      if (product && product.photo1 && product.photo1.data) {
          res.set("Content-Type", product.photo1.contentType);
          return res.status(200).send(product.photo1.data);
      } else {
          return res.status(404).send({
              success: false,
              message: "Photo not found",
          });
      }
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error while getting photo",
          error,
      });
  }
};



//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update
export const updateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping , photo, photo1, photo2, color} =
        req.fields;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
     
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Updte product",
      });
    }
  };

//filter
  export const productFiltersController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      const products = await productModel.find(args);
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const {keyword} = req.params;
    const results = await productModel.find({
        $or: [
          { name: { $regex: keyword, $options:"i" } },
          { description: { $regex: keyword, $options:"i" } },
        ],
      });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};


// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
