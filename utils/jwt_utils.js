import jwt from "jsonwebtoken"
import winston from "winston"
import "dotenv/config.js"

// create jwt token
export const createToken = async (data) => {
    return jwt.sign({data}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_MAXAGE
    })
}

// verify jwt token
export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}

// WINSTON LOGGER
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()]
});