import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import { hashPassword } from "../controllers/user.service.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Minimum password length is 6 characters"]
    },
    username: {
        type: String,
        unique: true
    }
}, {timestamps: true});

userSchema.pre('save', async function(){
    this.password = await hashPassword(this.password);
})

export const User = mongoose.model("user", userSchema);