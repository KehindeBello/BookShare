import jwt from "jsonwebtoken"
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

// get id of logged in user
export function loggedInUser(token) {
    const decodedToken = verifyToken(token);
    return decodedToken.data
}