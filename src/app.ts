import express, { Express } from "express";
import  * as dotenv from "dotenv";
import { AppDataSource } from "./utils/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use('/auth', authRoutes)

AppDataSource.initialize().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on the PORT ${process.env.PORT}`)
    })
})


