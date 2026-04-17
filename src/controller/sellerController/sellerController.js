
import {  seller } from "../../model/seller/sellerModel.js";
import statusCode from '../../utils/statusCode.js'

export const applySeller=async(req,res,next)=>{
    try{

        const userId=req.user.id; //this id is coming from authentication middleware


        //check if already apply
        const existingUser=await seller.findOne({user:userId});
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
            status:'IN_PROGRESS',
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


export const sellerProfile=async(req,res,next)=>{
    try{
        const userId=req.user.id;
        console.log("USERID",userId);

        const{
            businessName,
            businessType,
            address,
            phone,
            bankDetails

        }=req.body;
        console.log("Data comig from postman:",req.body);

        //find seller request
        const existingSeller=await seller.findOne({user:userId});
        console.log("existing seller",existingSeller)
        if(!existingSeller){
            return res.status(statusCode.NOT_FOUND).json({message:"Seller application not found"});
        }

        //prevent update if already approved
        existingSeller.businessName=businessName;
        existingSeller.businessType=businessType;
        existingSeller.address=address;
        existingSeller.phone=phone;
        existingSeller.bankDetails={
            accountHolderName:bankDetails.accountHolderName,
            ifscCode:bankDetails.ifscCode,
            accountNumber:bankDetails.accountNumber
        }

        //move seller to review stage
        existingSeller.status="UNDER_REVIEW";
        await existingSeller.save();

        return res.status(statusCode.SUCCESS).json({message:"Seller profile submitted for review"
            ,data:existingSeller
        });

    }catch(err){
        console.log("SERVER ERROR:",err.name,err.message);
        next(err);
    }
}