import express from "express";
import morgan from "morgan";
import fs from "fs"
import path from "path";
import mongoose from "mongoose";
import { Bookrouter } from "./routes/booksRoutes.js";
import { UserRouter } from "./routes/usersRoutes.js";
import cookieParser from "cookie-parser";
import "dotenv/config.js"

const root = "./"
const app = express()

// connect to db and start server
await mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true})
    .then(() => console.log("Connected to db"))
    .then(() => app.listen(process.env.PORT))
    .then(() => console.log(`Listening on http://localhost:${process.env.PORT}`))
    .catch((error) => {console.log(`Error - ${error}`)})


// streams for logs 
const writestream = fs.createWriteStream(path.join(root, "access.log"), {flags:"a"})
app.use(morgan(":date - :method - :url - :status - :response-time ms", {stream: writestream}));

// parser middleware
app.use(express.json());
app.use(cookieParser());

//Book routes
app.use('/books', Bookrouter);
app.use('/', UserRouter); // User/auth routes

// About Route
app.get('/about', (req,res) => {
    res.sendFile("./about.html", {root: './views'});
})

// 404 page
app.use((req,res) => {
    res.status(404).send("Page does not exist");
})