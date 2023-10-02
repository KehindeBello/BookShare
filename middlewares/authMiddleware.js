// Protected routes
import { verifyToken } from "../controllers/user.service.js";

export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            verifyToken(token)
            next();
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                message: "Unauthorized",
                status: false,
                data: null
            })
        }
    } else {
        return res.status(400).json({
            message: "Unauthorized",
            status: false,
            data: null
        })
    }
}