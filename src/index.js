console.log("Starting....")
import  {PORT}  from "./config.js"
import express from "express"
import userRoutes from "./routes/user.routes.js"
import morgan from "morgan"


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(userRoutes)

app.listen(PORT)

console.log("listening on port", PORT)