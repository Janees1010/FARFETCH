const express = require("express")
const app = express()
const cors = require("cors")
const orderRoutes = require("./routes/orderRoutes")
const DB = require("./dbConnection/connection")
require("dotenv").config()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))  

app.use(express.json())

app.use("/",orderRoutes)



DB()
app.listen(process.env.PORT,()=>console.log(`server is running on ${process.env.PORT}`));
 