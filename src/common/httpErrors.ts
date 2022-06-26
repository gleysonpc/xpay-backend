import statusCodes from 'http-status-codes';

export class GeneralError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
    getCode(){
        if(this instanceof BadRequest){
            return statusCodes.BAD_REQUEST;
        }

        if (this instanceof NotFound){
            return statusCodes.NOT_FOUND;
        }

        if (this instanceof Unauthorized){
            return statusCodes.UNAUTHORIZED;
        }

        if (this instanceof Forbidden){
            return statusCodes.FORBIDDEN;
        }

        if (this instanceof Conflict){
            return statusCodes.CONFLICT;
        }

        if (this instanceof InternalError){
            return statusCodes.INTERNAL_SERVER_ERROR;
        }

        return statusCodes.INTERNAL_SERVER_ERROR;
    }
}

export class BadRequest extends GeneralError { }
export class NotFound extends GeneralError { }
export class Forbidden extends GeneralError { }
export class Unauthorized extends GeneralError { }
export class InternalError extends GeneralError { }
export class Conflict extends GeneralError { }
