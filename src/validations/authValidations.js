import Joi from 'joi';
export const registerSchema=Joi.object({
    userName:Joi.string.min(3).required(),
    userEmail:Joi.string()
    .email({tlds:{allow:false}}) //avoid strict TLD error
    .required()
    .message({
        "string.empty":"Email is required",
        "string.email":"Email should be in correct formate"
    }),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid('user',"admin","seller").default('user')
});

export const loginSchema=Joi.object({
    userName:Joi.string.min(3).required(),
    userEmail:Joi.string()
    .email({tlds:{allow:false}}) //avoid strict TLD error
    .required()
    .message({
        "string.empty":"Email is required",
        "string.email":"Email should be in correct formate"
    }),
    password:Joi.string().min(6).required(),
    
})