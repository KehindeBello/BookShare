import express from "express";
import morgan from "morgan";
import fs from "fs"
import path from "path";

const port = 3300 | process.env.port;
const app = express()
const root = "./"

const writestream = fs.createWriteStream(path.join(root, "access.log"), {flags:"a"})

app.use(morgan(":date - :method - :url - :status - :response-time ms", {stream: writestream}));

app.get('/', (req, res) => {
    res.send("Flaunt and discover literary gems");
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log(`Ctrl + C to cancel`);
})
