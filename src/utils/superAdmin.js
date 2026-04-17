import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from "../model/authModel.js";
dotenv.config();

const createSuperAdmin=async()=>{
    try{

        await mongoose.connect(process.env.MONGODB_URL);
        const superAdminEmail="Ishika12@yopmail.com";

        //check if super admin already exist
        const existingAdmin=await User.findOne({email:superAdminEmail});
        if(existingAdmin){
            console.log("Super admin already exist");
            process.exit(1);//bydefault 0 for success
        }

        //hashed password
        const hashedPassword=await bcrypt.hash('Pass121',12);


        //create super admin
        const admin=await User.create({
            name:'Ishika Raut',
            email:superAdminEmail,
            password:hashedPassword,
            role:'admin' //super admin
        })

        console.log("super admin created successfully",admin);
        process.exit();

    }catch(err){
        console.log("Error while creating superAdmin",err.name);
        console.error(err.errors);//
        process.exit(1);
    }
};
createSuperAdmin();