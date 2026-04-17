import Joi from 'joi';
export const sellerSchema=Joi.object({

    businessName:Joi.string().required(),
    businessType:Joi.string().valid('individual','company'),
    address:Joi.string(),
    phone:Joi.string()
     .pattern(/^[0-9]{10,15}$/)
    .message("Phone number must be valid")
    .required(),
    bankDetails: Joi.object({
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required()
  }),
    rejectionReason:Joi.string().allow("",null)

})