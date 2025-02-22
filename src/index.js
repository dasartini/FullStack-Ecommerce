console.log("Starting....")
import express from "express"
import userRoutes from "./MVC/routes/routes.js"
import morgan from "morgan"
import { DB_PORT } from "./config.js"
import cors from "cors"

const app = express()

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ["https://cafe-tero.netlify.app"]
  : ["http://localhost:3000", "http://localhost:5000"];
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'))
app.use(express.json())
app.use("/uploads", express.static('src/uploads'))
app.use(userRoutes)

const PORT = DB_PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
