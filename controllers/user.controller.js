import { User } from "../models/User.js"
import { handleErrors, createToken, comparePassword } from "./user.service.js";


export class UserController {

    get_signup(req, res){
        res.status(200).send("Signup Page")
    }

    async post_signup(req,res){
        //destructure the request body
        let {email, password} = req.body;
        try {
            const user = await User.create({
                email,
                password
            })
            console.log(`User ${user.email} created`);
            const token = await createToken(user._id);
            
            // pass token into cookie
            res.cookie('jwt',token, {
                maxAge: 86400000,
                httpOnly: true
            })
            return res.status(201).json({
                message: "User created!",
                data : user.email
            });
        } catch (error) {
            console.log(error);
            const errors = handleErrors(error);
            res.status(400).json(errors);
        }
    }

    get_login(req,res){
        res.status(200).json({message: "Login Page"});
    }

    async post_login(req,res){
        const {email, password} = req.body;
        const user = await User.findOne({email});
        
        if (user) {
            const authorized = await comparePassword(password, user.password);
            if (authorized) {
                const token = await createToken(user._id);
                res.cookie('jwt', token, {maxAge: 259200000, httpOnly:true});

                return res.status(200).json({
                    message: "Login Successful",
                    status: true,
                    data: user.email
                })
            }
            return res.status(400).json({
                message: "Incorrect password",
                status: false,
                data: null
            })
        }
        res.status(400).json({
            message: "User doesn't exist",
            status: false,
            data: null
        })
    }
}