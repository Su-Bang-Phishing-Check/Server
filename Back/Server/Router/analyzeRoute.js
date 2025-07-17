import express from 'express';
import { analyse_text } from '../Controller/analyzeController.js';

const router = express.Router();

router.post('/text', analyse_text);

export default router;