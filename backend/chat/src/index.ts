import express from 'express';
import dotenv from 'dotenv';
import connetDB from './config/DB.js';

dotenv.config();

connetDB();

const app = express();


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})