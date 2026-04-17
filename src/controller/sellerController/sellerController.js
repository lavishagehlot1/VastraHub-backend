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
                message:'Seller profile already exist'
            })
        }

        //create seller
        const createSeller=await seller.findOne({
            user:userId,
            status:'IN_PROGRESS'
        });

        return res.status(statusCode.OK_COMPLETED).json({
            success:true,
            message:'Seller onboarding started successfully',
            createSeller
        });

    }catch(err){
        console.log("Sever error:",err.name);
        next(err);
    }
}