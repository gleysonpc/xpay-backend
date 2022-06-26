import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { ValidationResult, ValidationOptions, Schema  } from 'joi';

export function validateBody(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const options: ValidationOptions = {
            allowUnknown: false,
            abortEarly: false
        };
        const result: ValidationResult<unknown> = schema.validate(req.body, options);
        if (result.error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.error.message });
        }
        return next();
    };
}
