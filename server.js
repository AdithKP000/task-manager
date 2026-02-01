import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js"
import pool from "./config/db.js";

dotenv.config();

// Test Database Connection
pool.connect()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));


const app = express();
app.use(morgan("dev"))
app.use(cors("*"))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/api/v1/tasks", taskRoutes)


app.get("/*any", (req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});