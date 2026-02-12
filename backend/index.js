import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import dataRoute from './src/routes/dataRoute.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173", "https://localhost:5173"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api", dataRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
