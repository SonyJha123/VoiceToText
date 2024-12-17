import express from "express"
import connectdb from "./mondodb.js"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"

import userRoute from "./route/userRoute.js"
import userQueryRoute from "./route/user-queryRoute.js"
import collaboratesRoute from "./route/collaboratesRoute.js"

const app = express()
dotenv.config()
 const port = process.env.port || 8003
 app.use(express.json());
 app.use(cors())

 
app.use(bodyParser.urlencoded({extended: true}))

app.use("/users", userRoute)
app.use("/userQuerys", userQueryRoute)
app.use("/collaborates", collaboratesRoute)

app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on port ${port}`); 

})

connectdb()