import express from 'express';
import { analyse_text, analyse_image } from '../Controller/analyzeController.js';
import multer from 'multer';
import FormData from 'form-data';
import path from 'path';

const mstorage = multer.memoryStorage();
const upload = multer({storage: mstorage});

const router = express.Router();

router.post('/text', analyse_text);
router.post('/image', upload, analyse_image);

export default router;