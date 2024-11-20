const express = require("express")
const app = express()
const DB = require("./dbConnection/connection")
const cors = require("cors")
require("dotenv").config()
const natsConnection = require("./natsConnection/connection")
const subscribeMessage = require("./services/natsServices")
const cartRoutes = require("./routes/cartRoutes")


app.use(express.json())   
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true,
    })
  )      
      

app.use("/",cartRoutes)
const startServer = async () => {
  try {
    app.listen(process.env.PORT, () => { 
      console.log(`Server is running on ${process.env.PORT}`);
    });
    DB(); 
    const nc = await natsConnection(); 
    subscribeMessage(nc)  
  } catch (error) {
    console.error("Error starting server:", error);  
    process.exit(1);
  } 
};
  
startServer();     
