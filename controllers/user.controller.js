import { User } from "../models/User.js"
import { handleErrors, comparePassword } from "./user.service.js";
import { createToken, loggedInUser } from "../utils/jwt_utils.js";

export class UserController {

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
                maxAge: process.env.JWT_MAXAGE,
                httpOnly: true
            })
            return res.status(201).json({
                message: "User created!",
                data : user.email
            });
        } catch (error) {
            console.log(error.message)
            const errors = handleErrors(error);
            res.status(400).json(errors);
        }
    }

    async post_username (req,res) {
        const {username} = req.body
        const token = req.cookies.jwt;
        const user_id = loggedInUser(token)
        try {
            // check if usernane exists (is unique)
            const existingUserName = await User.findOne({username}, {password:0})
            console.log(`Existing Username : ${existingUserName}`)
            if (existingUserName) {
                return res.status(400).json({"Error": "Username already exists!"})
            }
            
            //update user data in db 
            await User.updateOne({_id: user_id}, { $set: {username: username} })
            
            // save username to session
            req.session.username = username;
            console.log(`Session Username ${req.session.username}`);

            return res.status(200).json({"message":"User name updated"});
            
        } catch(error) {
            console.log(error)
            return res.status(400).json(error.message);
        }
    }

    async post_login(req,res){
        const {email, password} = req.body;
        const user = await User.findOne({email});
        
        if (user) {
            const authorized = await comparePassword(password, user.password);
            if (authorized) {
                // create jwt token and assign to a cookie
                const token = await createToken(user._id);
                res.cookie('jwt', token, {maxAge: process.env.JWT_MAXAGE, httpOnly:true});

                // add username to session
                req.session.username = user.username;
                console.log("Logged in successfully!")
                
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

    async logout(req, res){
        // destroy cookies
        res.cookie("jwt", '', {maxAge: 1});
        res.cookie("connect.sid", '', {maxAge: 1});
        // TODO : Figure out why req.session.destroy() is not removing connect.sid from client
        return res.status(200).json({
            message: "Logout Successful",
            status: true,
            data: null
        })
    }
}