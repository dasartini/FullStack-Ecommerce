console.log("Starting....")
console.log("DATABASE_URL:",process.env.DATABASE_URL)
console.log("DB_PORT:",process.env.DB_PORT)
import express from "express"
import userRoutes from "./MVC/routes/routes.js"
import morgan from "morgan"
import { DB_PORT } from "./config.js"
import cors from "cors"

const app = express()

const allowedOrigins = ["https://cafe-tero.netlify.app"];
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'))
app.use(express.json())
app.use(userRoutes)

const PORT = DB_PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

