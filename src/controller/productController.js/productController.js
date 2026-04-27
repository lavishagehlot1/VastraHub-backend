import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary.js";
import productModel from "../../model/product/productModel.js";
import statusCode from "../../utils/statusCode.js";
import fs from "fs";

// export const createProduct = async (req, res, next) => {
//   try {
//     const sellerId = req.user.id;
//     console.log("Seller ID:", sellerId);

//     const { title, description, price, category, brand, stock } = req.body;
//     console.log("Product data coming from postman:", req.body);
//     if (!title || !description || !price || !category || !brand || stock === undefined || stock < 0) {
//       //here stock===undefined means if stock = 0 then so logic treat it as true means currently product is out of stock.
//       return res
//         .status(statusCode.BAD_REQUEST)
//         .json({ message: "All fields are required before creating a product" });
//     }

//     //normalize category for mongodb by converting it to an array of ObjectIds. This will ensure that we can store multiple categories for a product if needed in the future.
//     let categoryArray=category;
//     if (typeof category === "string") {
//       categoryArray = [category]; //if category is a string then we convert it to an array with one element which is the category string. 
//       // This will make it consistent with our product schema which expects an array of categories.

//     }

//     if (!Array.isArray(categoryArray) || categoryArray.length === 0) {
//       return res.status(statusCode.BAD_REQUEST).json({ message: "Atleast one category is required for creating a product" });
//     }

//     //valid objectId format for category IDs
//     if (categoryArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//       return res.status(statusCode.BAD_REQUEST).json({ message: "Invalid category ID format. Each category ID must be a valid MongoDB ObjectId." });
//     }
//     categoryArray = categoryArray.map((id) => new mongoose.Types.ObjectId(id)); //this will convert each category ID in the array to a mongoose 
//     // ObjectId which is required for storing in MongoDB.

//     //instead of loop we can use promise.all to upload multiple images to cloudinary in parallel and get the URLs. 
//     // This will be more efficient than uploading images one by one in a loop for future reference.
//     //upload images to cloudinary and get the URLs
//     const imagesUrl = []; //this empty array will hold the URLs of the uploaded images from cloudinary. 
//                         // We will push the secure_url of each uploaded image into this array.
//     if (req.files && req.files.length > 0) { //check if there are files in the request
//       for (const file of req.files) { //loop through each file and upload to cloudinary and request.files coms from multer middleware
//                                             // which we have used in the route to handle file uploads. It will give us an array of files in req.files.
//         const result = await cloudinary.uploader.upload(file.path,{folder:'VastraHub/products'}); //this will upload local files to cloudinary
//         console.log("Cloudinary upload result:", result);
//         imagesUrl.push({
//           url: result.secure_url,
//           public_id: result.public_id,
//         }); //cloudinary will return an object with details of the uploaded image, including secure_url which is the URL of the uploaded image.
//         // and public_id which is the ID of the uploaded image. We push this URL into our imagesUrl array.
//         // delete local file after upload
//       fs.unlinkSync(file.path);
//       }
//     }
//     console.log("Image URLs after uploading to cloudinary:", imagesUrl);

    

//     const newProduct = new productModel({
//       title,
//       description,
//       price,
//       category: categoryArray,
//       brand,
//       stock,
//       images: imagesUrl,
//       sellerId,
//     });
//     console.log("New product data before saving to database:", newProduct);

//     const savedProduct = await newProduct.save();
//     console.log("Saved product data after saving to database:", savedProduct);

//     return res.status(statusCode.SUCCESS).json({
//       success: true,
//       message: "Product created successfully",
//       data: savedProduct,
//     });
//   } catch (err) {
//     console.log("Server error in creating product", err.name, err.message);
//     next(err);
//   }
// };

export const createProduct = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    console.log("Seller ID:", sellerId);

    const { title, description, price, category, brand, stock } = req.body;

    console.log("Product data coming from postman:", req.body);

    // check if all required fields are present
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !brand ||
      stock == null ||
      stock < 0
    ) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "All fields are required before creating a product",
      });
    }

    
    // CATEGORY NORMALIZATION
    
    let categoryArray = category;

    // if category is string then convert it into array
    if (typeof category === "string") {
      categoryArray = [category];
    }

    if (!Array.isArray(categoryArray) || categoryArray.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "At least one category is required",
      });
    }

    // validate ObjectId format
    if (categoryArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "Invalid category ID format",
      });
    }

    // convert string ids into ObjectId
    categoryArray = categoryArray.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

  

    const imagesUrl = []; 
    // this array will store all uploaded image URLs and public_id from cloudinary

    // check if files exist in request (multer provides req.files)
    if (req.files && req.files.length > 0) {

      // instead of uploading images one by one (slow),
      // we use Promise.all to upload all images in parallel (faster & optimized)

      const uploadPromises = req.files.map(async (file) => {

        // upload local file to cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "VastraHub/products", // all product images will go inside this folder
        });

        console.log("Cloudinary upload result:", result);

        // delete file from local server after successful upload
        fs.unlinkSync(file.path);

        // return only required data (we don’t store full cloudinary response)
        return {
          url: result.secure_url,     // secure image URL (for frontend)
          public_id: result.public_id // used for delete/update later
        };
      });

      // wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);

      // store all uploaded images in array
      imagesUrl.push(...uploadedImages);
    }

    console.log("Image URLs after uploading to cloudinary:", imagesUrl);

    
    // CREATE PRODUCT IN DATABASE
    

    const newProduct = new productModel({
      title,
      description,
      price,
      category: categoryArray,
      brand,
      stock,
      images: imagesUrl,
      sellerId,
    });

    console.log("New product data before saving to database:", newProduct);

    // save product in DB
    const savedProduct = await newProduct.save();

    console.log("Saved product data after saving to database:", savedProduct);

    // success response
    return res.status(statusCode.SUCCESS).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });

  } catch (err) {
    console.log("Server error in creating product", err.name, err.message);
    next(err);
  }
};