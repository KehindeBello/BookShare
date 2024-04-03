import { Collection } from "../models/Collection.js";
import { Book } from "../models/Books.js"
import { logger } from "../utils/jwt_utils.js"

export class CollectionController {

    async create_collection(req,res) {
        const user_id = req.user._id;

        try {    
            const { name } = req.body
            const data = { 
                name: name,
                user_id: user_id
            };

            const collection = new Collection(data)
            const newCollection = await collection.save()

            logger.info(`New Collection - "${newCollection.name}" created for ${req.user.username}`)

            return res.status(201).json({
                message: `${newCollection.name} created`,
                status: true,
                data: newCollection
            })
        } catch (error) {
            logger.error(`Create Collection Error - ${error.message}`)
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async get_collection(req, res) {
        const user_id = req.user._id
        const collection_id = req.params.id
        
        try {            
            if (collection_id) {
                const collections = await Collection.findOne({_id: collection_id, user_id: user_id})
                logger.info(`Get Collection - ${collections.name} fetched`)
                return res.status(200).json({
                    message: "Collections fetched",
                    status: true,
                    data: collections
                })
            }
            const collections = await Collection.find({user_id:user_id}).sort({createdAt: "desc"})
            logger.info(`All collections of ${req.user.username} fetched`);
            return res.status(200).json({
                message: "Collections fetched",
                status: true,
                data: collections
            })
    
        } catch (error) {
            logger.error(`Fetch Collection Error - ${error.message}`)
            res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async books_to_collection(req, res) {
        const collection_id = req.params.id;
        const { book_id } = req.body;

        try {
            const books = await Book.find({_id: { $in: book_id}})
            const updatedCollection = await Collection.findOneAndUpdate({_id:collection_id}, {$push: {books: {$each : book_id }}}, {returnDocument : "after"})
            logger.info(`Add to Collection - ${books.map(book => book.name)} added to collection`) 
            return res.status(201).json({
                message: `Added to Collection`,
                status: true,
                data: updatedCollection
            })

        } catch (error) {
            logger.error(`Add Books to Collection Error - ${error.message}`)
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }
    
    async delete_collection(req, res) {
        const id = req.params.id;

        try {
            await Collection.findByIdAndDelete(id);
            logger.info(`Collection Deleted`)
            return res.status(200).json({
                message: "Collection Deleted",
                status: true,
                data: null
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }
}