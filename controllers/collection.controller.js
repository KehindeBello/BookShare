import { isValidObjectId } from "mongoose";
import { Collection } from "../models/Collection.js";
import { loggedInUser } from "../utils/jwt_utils.js"

export class CollectionController {

    async create_collection(req,res) {
        try {
            const token = req.cookies.jwt;
            const user_id = loggedInUser(token)
            const { name } = req.body
            const data = { 
                name: name,
                user_id: user_id
            };
            // i need only the name of the collection
            // the userId can be gotten from the loggedIn User

            const collection = new Collection(data)
            const newCollection = await collection.save()
            return res.status(201).json({
                message: `Collection ${newCollection.name} created`,
                status: true,
                data: "Books"
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async get_collection(req, res) {
        try {
            const token = req.cookies.jwt;
            const user_id = loggedInUser(token)
            const collections = await Collection.find({user_id:user_id}).sort({createdAt: "desc"})
            return res.status(200).json({
                message: "Collections fetched",
                status: true,
                data: collections
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async add_book_to_collection(req,res){
        try{
            const collection_id = req.params.id;
            const { book_id } = req.body;
            if (isValidObjectId(book_id)){
                await Collection.updateOne({_id:collection_id},{$push: {books: book_id}})
            }   
            return res.status(201).json({
                message: "Book added",
                status: true,
                data: null
            })
        } catch(error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }
}