import express from 'express';
import analyseRoutes from './Router/analyzeRoute.js';
import {chatbot} from './Controller/chatbotController.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { sync_db } from './DB/noticeDB.js';
import noticeRoutes from './Router/noticeRoute.js';

dotenv.config();

await sync_db();


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://xn--hw4bo2pv3cz9f.com',
    credentials: true
}));

app.use('/analyse', analyseRoutes);
app.use('/notice', noticeRoutes);
app.post('/chatbot', chatbot);


app.listen(3300, '0.0.0.0', ()=>{
    console.log("backend server started");
});

