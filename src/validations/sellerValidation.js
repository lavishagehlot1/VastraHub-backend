import Joi from 'joi';
export const sellerProfileSchema=Joi.object({

    businessName:Joi.string().required(),
    businessType:Joi.string().valid('individual','company'),
    address:Joi.string(),
    phone:Joi.string()
     .pattern(/^[0-9]{10,15}$/)
    .message("Phone number must be valid")
    .required(),
    bankDetails: Joi.object({
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().pattern(/^[0-9]{9,18}$/).required(),
    ifscCode: Joi.string()
    .uppercase()
    .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .message("Invalid IFSC code format")
    .required()
}),
    //rejectionReason:Joi.string().allow("",null)

})