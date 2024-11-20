// searchService.js
const { findSearchedProducts } = require("../repository/productRepository");
const redisConnection = require("../services/redisService"); 

const getSearchProducts = async (query) => {
    try {
        const redis = await redisConnection();
        const cachedResults = await redis.get(`search:${query.toLowerCase()}`);
        if (cachedResults) {
            console.log('Using cached results for:', query);
            return JSON.parse(cachedResults); 
        }
        const response = await findSearchedProducts(query);
        await redis.set(`search:${query.toLowerCase()}`, JSON.stringify(response), 'EX', 1800);  // Cache for 30 minut
        return response;
    } catch (error) {
        throw new Error(error.message);  
    }      
};

module.exports = getSearchProducts;
