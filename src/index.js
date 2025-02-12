console.log("Starting....")
import express from "express"
import userRoutes from "./MVC/routes/routes.js"
import morgan from "morgan"

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(userRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

