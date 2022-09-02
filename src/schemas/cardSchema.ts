import joi from 'joi';

export const newCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string()
    .valid('groceries', 'restaurants', 'transport', 'education', 'health')
    .required()
});

export const activateCardSchema = joi.object({
    employeeId: joi.number().required(), 
    securityCode: joi.string()
        .length(3)
        .required()
        .regex(/^[0-9]*$/)
        .messages({
        'string.pattern.base': '"securityCode" must be a numeric string',
    }), 
    password: joi.string()
        .regex(/^[0-9]*$/)
        .length(4)
        .messages({
        'string.pattern.base': '"password" must be a numeric string',
    })
})
