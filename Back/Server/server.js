import express from 'express';
import analyseRoutes from './Router/analyzeRoute.js'
import {chatbot} from './Controller/chatbotController.js'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(express.json());


app.use(cors({
    origin: 'https://xn--hw4bo2pv3cz9f.com',
    credentials: true
}));
app.use('/analyse', analyseRoutes);
app.post('/chatbot', chatbot);


app.listen(3300, '0.0.0.0', ()=>{
    console.log("backend server started");
});

