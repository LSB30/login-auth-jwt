import express, { Express } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./utils/db";

dotenv.config();


const app: Express = express();
app.use(express.json());

AppDataSource.initialize().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on the PORT ${process.env.PORT}`)
    })
})


