//single validation middlewarefor all body,query,params
export const validation=(schemas)=>(req,res,next)=>{
    try{
            //  schemas = { body: JoiSchema, query: JoiSchema, params: JoiSchema }

             // 1️ Validate request body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) throw error; //  throw error to global error handler
      req.body = value; // sanitized data
    }

    // 2 Validate query parameters
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) throw error;
      req.query = value; // sanitized data
    }

    // 3️Validate route params
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) throw error;
      req.params = value; // sanitized data
    }

    next(); // everything passed validation
    }catch(err){
        next(err);
    }
}