const mongoose = require("mongoose")
require("dotenv").config()

const connectDb = ()=>{
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("mongoDb connected");
    }catch (error) {
         console.log(error.message);   
    }
}
      
module.exports = connectDb