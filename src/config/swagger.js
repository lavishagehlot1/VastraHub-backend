import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Auth API',
            version:'1.0.0',
            description:'Authentication system API documentation'
        }
    },
    apis:['./src/routes/*.js'], 
}

const swaggerDocs=swaggerJSDoc(swaggerOptions);
export{swaggerUi,swaggerDocs}