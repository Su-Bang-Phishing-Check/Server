import express from 'express';
import { mainNotice, pageNotice } from '../Controller/noticeController.js';

const Router = express.Router();

Router.get('/mainNotice', mainNotice);
Router.get('/pageNotice', pageNotice);


export default Router;