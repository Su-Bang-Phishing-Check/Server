import express from 'express';
import analyseRoutes from './Router/analyzeRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './Router/noticeRoute.js';
import cron from 'node-cron';
import {chatbot} from './Controller/chatbotController.js';
import { sync_db } from './DB/noticeDB.js';
import {add_feedback} from './Controller/feedbackController.js'


dotenv.config();

//await sync_db();


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://xn--hw4bo2pv3cz9f.com',
    credentials: true
}));

app.use('/analyse', analyseRoutes);
app.use('/notice', noticeRoutes);
app.post('/chatbot', chatbot);
app.post('/feedback', add_feedback);


cron.schedule('0 0,12 * * *', async ()=>{
    console.log('DB 동기화 시작');
    await sync_db();
    console.log('DB 동기화 완료');
});



app.listen(3300, '0.0.0.0', ()=>{
    console.log("backend server started");
});

