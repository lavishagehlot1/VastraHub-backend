import cloudinary from "../../config/cloudinary.js";
import productModel from "../../model/product/productModel.js";
import statusCode from "../../utils/statusCode.js";
import fs from "fs";

export const createProduct = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    console.log("Seller ID:", sellerId);

    const { title, description, price, category, brand, stock } = req.body;
    console.log("Product data coming from postman:", req.body);
    if (!title || !description || !price || !category || !brand || stock === undefined || stock < 0) {
      //here stock===undefined means if stock = 0 then so logic treat it as true means currently product is out of stock.
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: "All fields are required before creating a product" });
    }

    //instead of loop we can use promise.all to upload multiple images to cloudinary in parallel and get the URLs. 
    // This will be more efficient than uploading images one by one in a loop for future reference.
    //upload images to cloudinary and get the URLs
    const imagesUrl = []; //this empty array will hold the URLs of the uploaded images from cloudinary. 
                        // We will push the secure_url of each uploaded image into this array.
    if (req.files && req.files.length > 0) { //check if there are files in the request
      for (const file of req.files) { //loop through each file and upload to cloudinary and request.files coms from multer middleware
                                            // which we have used in the route to handle file uploads. It will give us an array of files in req.files.
        const result = await cloudinary.uploader.upload(file.path,{folder:'VastraHub/products'}); //this will upload local files to cloudinary
        console.log("Cloudinary upload result:", result);
        imagesUrl.push({
          url: result.secure_url,
          public_id: result.public_id,
        }); //cloudinary will return an object with details of the uploaded image, including secure_url which is the URL of the uploaded image.
        // and public_id which is the ID of the uploaded image. We push this URL into our imagesUrl array.
        // delete local file after upload
      fs.unlinkSync(file.path);
      }
    }
    console.log("Image URLs after uploading to cloudinary:", imagesUrl);

    

    const newProduct = new productModel({
      title,
      description,
      price,
      category,
      brand,
      stock,
      images: imagesUrl,
      sellerId,
    });
    console.log("New product data before saving to database:", newProduct);

    const savedProduct = await newProduct.save();
    console.log("Saved product data after saving to database:", savedProduct);

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
