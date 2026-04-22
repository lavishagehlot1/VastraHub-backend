
import {  seller } from "../../model/seller/sellerModel.js";
import statusCode from '../../utils/statusCode.js'

export const applySeller=async(req,res,next)=>{
    try{

        const userId=req.user.id; //this id is coming from authentication middleware


        //check if already apply
        const existingUser=await seller.findOne({user:userId}).populate('user','name email'); //populate user field to get the name and email of the user who applied for seller onboarding
            console.log("Existing user:",existingUser);
        if(existingUser){
            return res.status(statusCode.CONFLICT).json({
                success:false,
                message:'Seller profile already exist',
                status:existingUser.status
            })
        }

        //create seller
        const createSeller=await seller.create({
            user:userId,
            status:'DRAFT',
            createdAt:new Date()
        });

        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'Seller onboarding started successfully',
           data: createSeller
        });

    }catch(err){
        console.log("Sever error:",err.name);
        next(err);
    }
};




export const sellerProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            businessName,
            businessType,
            address,
            phone,
            bankDetails
        } = req.body;

        // validation
        if (!businessName || !businessType || !address || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!bankDetails) {
            return res.status(400).json({ message: "Bank details are required" });
        }

        const { accountHolderName, accountNumber, ifscCode } = bankDetails;

        const existingSeller = await seller.findOne({ user: userId });
         //its better to use findOne instead of findById because we are searching by user field not by _id
      //its mongoose document now not a plain js object if i want to change or mutate it i can do it and then call save method to persist the changes in db

        if (!existingSeller) {
            return res.status(404).json({ message: "Seller application not found" });
        }

        if (existingSeller.status === "APPROVED") {
            return res.status(400).json({ message: "Already approved, cannot update" });
        }

        if (existingSeller.status === "UNDER_REVIEW") {
            return res.status(400).json({ message: "Cannot update while under review" });
        }

        await existingSeller.populate('user', 'name');

        const userNameFromDb = existingSeller.user.name;
        console.log("userNameFromDb:",userNameFromDb)

        
        let isVerified = false;

        existingSeller.businessName = businessName;
        existingSeller.businessType = businessType;
        existingSeller.address = address;
        existingSeller.phone = phone;

        existingSeller.bankDetails = {
            accountHolderName,
            ifscCode,
            accountNumber,
            isVerified
        };

        existingSeller.status = "DRAFT";

        await existingSeller.save();

        //  masking acount number for security
        const sellerData = existingSeller.toObject();
         //convert mongoose document to plain js object beacuse if we directly mutate the 
       // existingSeller it will change the value in db as well because its a mongoose document but we want to mask the account number         // only in response not in db so we need to convert it to plain js object and then mask the account number.

        sellerData.bankDetails.accountNumber =
            "XXXX" + accountNumber.slice(-4);

        return res.status(200).json({
            message: "Seller profile saved as draft",
            data: sellerData
        });

    } catch (err) {
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);
    }
};

export const submitForReview=async(req,res,next)=>{
    try{
        const userId=req.user.id;

        const existingSeller=await seller.findOne({user:userId});
        if(!existingSeller){
            return res.status(statusCode.NOT_FOUND).json({
                success:false ,
                message:"Seller application is not found"
            })
        }
        if(existingSeller.status==="APPROVED"){
            return res.status(statusCode.BAD_REQUEST).json({message:"Application is already approved"});
        }

        //validation for mandatory fields before submit for review
        if(!existingSeller.businessName||
            !existingSeller.businessType||
            !existingSeller.address||
            !existingSeller.phone||
            !existingSeller.bankDetails||
            !existingSeller.bankDetails.accountHolderName||
            !existingSeller.bankDetails.accountNumber||
            !existingSeller.bankDetails.ifscCode
        ){
            return res.status(statusCode.BAD_REQUEST).json({
                success:false,
                message:"All fields are required before submit for review"
            })
        }
        if(existingSeller.status==="UNDER_REVIEW"){
            return res.status(statusCode.BAD_REQUEST)
            .json({message:"Already submitted for review"})
        }

         await existingSeller.save();

        return res.status(200).json({
            message: "Submitted for review",
            existingSeller
        });
    }catch(err){
        console.log("SERVER ERROR:", err.name, err.message);
        next(err);

    }
}

export const approveSeller=async(req,res,next)=>{
    try{
        const sellerId=req.params.id;
        console.log("sellerID:",req.params);

    const sellerData=await seller.findById(sellerId).populate('user');
        console.log("SellerData:",sellerData);

        if(!sellerData) {return res.status(statusCode.BAD_REQUEST).json({message:"Seller not found"})}

        if(sellerData.status!=="DRAFT" && sellerData.status!=="UNDER_REVIEW"){
            return res.status(statusCode.BAD_REQUEST).json({message:"Seller is not under review"})
        }

        sellerData.status="APPROVED";
        sellerData.rejectionReason=null;

        await sellerData.save();
        return res.status(statusCode.SUCCESS).json({
            success:true,
            message:"You are now seller",
            data:sellerData
        })
    }catch(err){
        console.log("SERVER ERROR:",err.name,err.message);
        next(err);
    }
}

export const rejectSeller=async(req,res,next)=>{
    try{
        const sellerId=req.params.id;
        const{rejectionReason}=req.body;

        const sellerData=await seller.findById(sellerId).populate('user','name email');
        console.log("Seller data:",sellerData);
        if(!sellerData){return res.status(statusCode.BAD_REQUEST).json({message:"Seller not found"})}

        if(sellerData.status!=="DRAFT" && sellerData.status!=="UNDER_REVIEW"){
            return res.status(statusCode.BAD_REQUEST).json({message:"Seller is not under review"})
        }

        sellerData.status="REJECTED";
        sellerData.rejectionReason=rejectionReason||"Your application is rejected by admin";

        await sellerData.save();
        return res.status(statusCode.SUCCESS).json({
            success:true,
            message:"Seller application rejected",
            data:sellerData
        });
    }catch(err){
        console.log("SERVER ERROR:",err.name,err.message);
        next(err);
    }
}