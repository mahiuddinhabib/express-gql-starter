import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // Log the error
    // console.error('Error:', err);

    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};
