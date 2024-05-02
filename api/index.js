import express from "express"
import dotenv from "dotenv"

import connectToMongoDB from "./db/connectToMongoDB.js"
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.routes.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  connectToMongoDB()
  console.log(`Server is running on Port ${PORT}`)
})
