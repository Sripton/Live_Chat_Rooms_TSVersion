import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());



app.listen(PORT, () => console.log(`Server started on ${PORT} PORT`));
