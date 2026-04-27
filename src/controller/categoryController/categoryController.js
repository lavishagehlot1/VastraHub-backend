import categoryModel from "../../model/categoryModel/categoryModel.js";
import statusCode from "../../utils/statusCode.js";

export const createCategory=async(req,res,next)=>{
    try{
        const{name,parentCategory}=req.body;
        console.log("Category data from postman:", req.body);
        if(!name){
            return res.status(statusCode.BAD_REQUEST).json({message:"Category name is required"})
        }

        //slug generation
        const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

        //duplicate category name check
        const exitingCategory=await categoryModel.findOne({$or:[{name:name},{slug:slug}]});
        if(exitingCategory){
            return res.status(statusCode.CONFLICT).json({message:"Category already exist"})
        }
        
        //create category
        const newCategory=await categoryModel.create({
            name,
            slug,
            parentCategory:parentCategory || null
        })

        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'Category created successfully',
            data:newCategory
        })
    }catch(err){
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);
    }
}

export const getAllCategory=async(req,res,next)=>{
    try{
        const allCategory=await categoryModel.find().populate('parentCategory');
        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'All category get sucessfully',
            data:allCategory
        })
    }catch(err){
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);
    }
};

export const getCategoryById=async(req,res,next)=>{
    try{
        const categoryId=req.params.id;
        console.log("Category ID from request params:", categoryId);

        const getCategory=await categoryModel.findById(categoryId).populate('parentCategory');
        if(!getCategory){
            return res.status(statusCode.NOT_FOUND).json({message:'Category not found'});
        }
        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'Category get successfully',
            data:getCategory
        })
    }catch(err){
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);
    }
}

//create tree api for category

export const updateCategoryById=async(req,res,next)=>{
    try{
        const categoryId=req.params.id;
        console.log("Category ID from request params:", categoryId);

        const{name,parentCategory}=req.body;
        console.log("Updated category data from request body:", req.body);
        const updateCategory=await categoryModel.findById(categoryId);
        if(!updateCategory){
            return res.status(statusCode.NOT_FOUND).json({message:'Category not found'});
        }
        if(name){
            updateCategory.name=name;
            //update slug if name is updated
            updateCategory.slug = name.toLowerCase().replace(/ /g, "-");
        }

        if(parentCategory!==undefined){
            updateCategory.parentCategory=parentCategory;
        }
        const savedCategory=await updateCategory.save();
        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'Category updated successfuly',
            data:savedCategory
        })

    }catch(err){
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);
    }
}

export const deleteCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // //  Validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    //   return res.status(400).json({ message: "Invalid category ID" });
    // }

    //  Check subcategories
    const hasChildren = await categoryModel.findOne({ parentCategory: categoryId });
    if (hasChildren) {
      return res.status(400).json({
        message: "Cannot delete category with subcategories"
      });
    }

    //  Check products
    const hasProducts = await productModel.findOne({ category: categoryId });
    if (hasProducts) {
      return res.status(400).json({
        message: "Cannot delete category with products"
      });
    }

    //  Delete category
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory
    });

  } catch (err) {
    console.log("SERVER ERROR:", err.name, err.message);
    next(err);
  }
};