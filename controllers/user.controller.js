import { User } from "../models/User.js"
import { handleErrors, comparePassword } from "./user.service.js";
import { createToken, logger } from "../utils/jwt_utils.js";

export class UserController {

    async post_signup(req,res){
        //destructure the request body
        let {email, password} = req.body;
        try {
            const user = await User.create({
                email,
                password
            })
            const id_token = await createToken(user.id);
            logger.info(`User ${email} created`);
            
            return res.status(201).json({
                message: `User ${email} created!`,
                data : id_token
            });
        } catch (error) {
            logger.error(error.message)
            const errors = handleErrors(error);
            res.status(400).json(errors);
        }
    }

    async post_username (req,res) {
        const {username} = req.body
        const user_id = req.user;
        
        // check if username exists
        const existingUserName = await User.findOne({username}, {password:0})
        if (existingUserName) {
            logger.warn(`Username - ${existingUserName} already exists`) 
            return res.status(400).json({"Error": "Username already exists!"})
        }
        try {
            //update user data in db 
            const updatedUser = await User.findOneAndUpdate({_id: user_id}, { $set: {username: username}}, {returnDocument : 'after'}); 
            logger.info(`Username updated - ${updatedUser.username}`);
            
            // sign the whole user object
            const new_token = await createToken(updatedUser)

            return res.status(200).json({
                message: `User-name ${username} updated`,
                data: new_token
            });
            
        } catch(error) {
            logger.error(error)
            return res.status(400).json(error.message);
        }
    }

    async post_login(req,res){
        const {email, password} = req.body;
        const user = await User.findOne({email});
        
        if (user) {
            const authorized = await comparePassword(password, user.password);
            if (authorized) {
                //create access token
                const token = await createToken(user);
                logger.info(`${email} logged in successfully!`)
                
                return res.status(200).json({
                    message: "Login Successful",
                    status: true,
                    data: token
                })
            }
            return res.status(401).json({
                message: "Incorrect password",
                status: false,
                data: null
            })
        }
        res.status(400).json({
            message: "User not found",
            status: false,
            data: null
        })
    }

    async logout(req, res){
        req.session.destroy()
        logger.info(`User logged out!`)

        return res.status(200).json({
            message: "Logout Successful",
            status: true,
            data: null
        })
    }
}