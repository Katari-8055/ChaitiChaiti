import express from 'express';
import dotenv from 'dotenv';
import connetDB from './config/DB.js';
import { createClient } from 'redis';
import userRoutes from './routes/user.js';
import { connectToRabbitMQ } from './config/Rabitmq.js';
import cors from 'cors';
dotenv.config();
connetDB();
connectToRabbitMQ();
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("REDIS_URL is not defined in .env");
}
export const redisClient = createClient({
    url: redisUrl,
});
redisClient.connect().then(() => {
    console.log("Connected to Redis");
}).catch((err) => {
    console.log(err);
    process.exit(1);
});
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", userRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`User service is running on port ${port}`);
});
//# sourceMappingURL=index.js.map