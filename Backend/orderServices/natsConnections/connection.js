const {connect,StringCodec} = require("nats")

const createNatsConnection = async()=>{
     try { 
        const nc = await connect({servers:"nats://localhost:4222"})
        console.log("connected to nats");
        return nc
     } catch (error) {
         console.error("Error connecting to NATS:", error);
         process.exit(1);
     }
}
 
module.exports = createNatsConnection  