import express from "express";
import morgan from "morgan";
import fs from "fs"
import path from "path";
import { Book } from "./models/Books.js";
import mongoose from "mongoose";
import { config } from "./config.js"
import { Bookrouter } from "./routes/booksRoutes.js";

const port = 3300 | process.env.port;
const root = "./"
const app = express()

// connect to db and start server
await mongoose.connect(config.MONGO_URI,  { useNewUrlParser: true})
    .then((connection) => console.log("Connected to db"))
    .then(() => app.listen(port))
    .then(() => console.log(`Listening on http://localhost:${port}`))
    .catch((error) => {console.log(`Error - ${error}`)})


// streams for logs 
const writestream = fs.createWriteStream(path.join(root, "access.log"), {flags:"a"})
app.use(morgan(":date - :method - :url - :status - :response-time ms", {stream: writestream}));

// parser middleware
app.use(express.json());

//Book routes
app.use('/books', Bookrouter);

// About Route
app.get('/about', (req,res) => {
    res.sendFile("./about.html", {root: './views'});
})

// 404 page
app.use((req,res) => {
    res.status(404).send("Page does not exist");
})