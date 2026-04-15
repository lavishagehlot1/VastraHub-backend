import statusCode from '../utils/statusCode.js';

const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Joi validation error
    if (err.isJoi) {
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: err.details.map(detail => detail.message).join(',') // show all Joi messages
        });
    }

    return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error'
    });
};

export default globalErrorHandler;