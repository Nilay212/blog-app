import express from "express"
import dotenv from "dotenv"

import connectToMongoDB from "./db/connectToMongoDB.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  connectToMongoDB()
  console.log(`Server is running on Port ${PORT}`)
})
