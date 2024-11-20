const express = require("express")
const app = express()
const natsConnection = require("./natsConnection/connection")
const cors = require("cors")
const DB = require("./dbConnection/connection")
const productRoutes = require("./routes/productRoute")
const {subscribeMessage} = require("./services/natsServices")
require("dotenv").config()
 
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);  
app.use(express.json())   
app.use(express.urlencoded({ extended: true }));       

  
app.use("/",productRoutes)

  


const startServer = async () => {
  try {
    const nc = await natsConnection(); // Establish the NATS connection
    subscribeMessage(nc)
    app.listen(process.env.PORT, () => { 
      console.log(`Server is running on ${process.env.PORT}`);
    });
    await DB(); // Ensure the database connection is established
  } catch (error) {
    console.error("Error starting server:", error);  
    process.exit(1); // Exit the process if there’s an error
  }
};   
 
startServer();          