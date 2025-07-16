import express from 'express';
import analyseRoutes from './Router/analyzeRoute.js'
const app = express();
app.use(express.json());

app.use('/analyse', analyseRoutes);


app.listen(3300, '0.0.0.0', ()=>{
    console.log("backend server started");
});