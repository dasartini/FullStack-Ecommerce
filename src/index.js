console.log("Starting....")
import  {PORT}  from "./config.js"
import express from "express"
import userRoutes from "./MVC/routes.js"
import morgan from "morgan"
// import {
//     DB_DATABASE,
//     DB_HOST,
//     DB_PASSWORD,
//     DB_PORT,
//     DB_USER,
//   } from "./config.js";

// console.log()
//   console.log(DB_USER, "USER", DB_DATABASE, "<-database",DB_HOST, "<-hoster",
//     DB_PASSWORD, "<-passwors", DB_PORT, "<-port"
//   )
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(userRoutes)

app.listen(PORT)

console.log("listening on port", PORT)