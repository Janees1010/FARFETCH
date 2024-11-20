const redisConnection  = require("../services/redisService")


const clearCacheForQuery = async () => {
    try {
        const redis = await redisConnection();
        const keys = await redis.keys("search:*");  
        if (keys.length > 0) {
            await redis.del(keys);  // Clear all matching keys
            console.log("Cleared all search cache.");
         }
    } catch (error) {
        throw new Error(error.message)
        
    }
};

module.exports = clearCacheForQuery