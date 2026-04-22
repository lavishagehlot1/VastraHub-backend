import productModel from "../../model/product/productModel.js";
import statusCode from "../../utils/statusCode.js";

export const createProduct=async(req,res,next)=>{
    try{
        const sellerId=req.user.id;
        console.log("Seller ID:",sellerId);

        const{title,description,price,category,brand,stock}=req.body;
        console.log("Product data coming from postman:",req.body);
        if(!title||!description||!price||!category||!brand||!stock){
            return res.status(statusCode.BAD_REQUEST).json({message:"All fields are required before creating a product"})
        }

        //upload images to cloudinary and get the URLs
        const imagesUrl=[];
        if(req.files&&req.files.length>0){
            for(const file of req.files){
                imagesUrl.push(file.path); //multer will give us the path of the uploaded file
            }
        }
        console.log("Image URLs after uploading to cloudinary:",imagesUrl);
        

        const newProduct=new productModel({
            title,
            description,
            price,
            category,
            brand,
            stock,
            images,
            sellerId
            
        });
        console.log("New product data before saving to database:",newProduct);

        const savedProduct=await newProduct.save();
        console.log("Saved product data after saving to database:",savedProduct);

        return res.status(statusCode.SUCCESS).json({
            success:true,
            message:'Product created successfully',
            data:savedProduct   
        })

    }catch(err){
        console.log("Server error in creating product",err.name,err.message);
        next(err);
    }
}