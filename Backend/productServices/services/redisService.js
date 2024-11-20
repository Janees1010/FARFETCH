const Redis = require("ioredis");

let redisClient = null;

const redisConnection = async () => {
    try {
        if (!redisClient) {
            redisClient = new Redis({
                host: '127.0.0.1',  // Redis server address (local)
                port: 6379,         // Redis server port (default is 6379)
                password: '',       // Password if your Redis is password-protected (empty if not)
                db: 0               // Redis database index (default is 0)
            });
            redisClient.on('connect', () => {
                console.log('Connected to Redis');
            });
            redisClient.on('error', (err) => {
                console.error('Error connecting to Redis:', err);
            });
        }
        return redisClient;
    } catch (error) {
        throw error;   
    }
};

module.exports = redisConnection;
