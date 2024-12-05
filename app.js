import express from 'express';
import cors from 'cors';
import aliasRouter from "./router/user.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public")) // If you want to use some static file (recommendation: public folder) then through this you can access
app.use(cookieParser())


// routes


// routes declaration
app.use("/api/v1/users", aliasRouter)


export default app