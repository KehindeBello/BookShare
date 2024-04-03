// Protected routes
import { verifyToken } from "../utils/jwt_utils.js";

export const requireAuth = (req, res, next) => {
    // const token = req.cookies.jwt;
    const authHeader = req.headers["authorization"]
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: 'Unauthorized, Bearer token missing!'})
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token)
    req.user = decoded.data
    next();
} 
    