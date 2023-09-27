import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config.js"

// handler for database errors
export const handleErrors = (err) => {
    let errors = {email: '', password: ''};
    // unique error - E11000 duplicate key error collection
    if (err.code === 11000) {
        errors.email = "Email already exists"
        return errors
    }

    // validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }   
    return errors;
}

// hash password
export const hashPassword = async (data) => {
    const salt_rounds = 10
    const salt = await bcrypt.genSalt(salt_rounds)
    return await bcrypt.hash(data, salt);
}

// create jwt token
export const createToken = async (data) => {
    return jwt.sign({data}, config.JWT.secret, {
        expiresIn: config.JWT.maxAge
    })
}