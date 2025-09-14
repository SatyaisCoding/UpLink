import type { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // For now, just assign userId
    req.userId = '1';

    // Must call next() to continue to route handler
    next();
}
