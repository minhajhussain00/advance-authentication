import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
dotenv.config()
// Use cookie-parser
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// Use JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth",authRoute)

const PORT = process.env.PORT || 2001;
connectDB()
    .then(()=>{
        app.listen(PORT);
        console.log(`Server blasting off at http://localhost:${PORT}`);
    })
    .catch((error) => {
        console.log('Database connection failed', error)
    })
    .finally(()=>{
        console.log("Enjoy :)")
    })
