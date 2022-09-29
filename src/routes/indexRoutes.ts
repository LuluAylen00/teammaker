import * as express from "express";
const path = require("path");
const app = express.Router();
import {mainController} from '../controllers/mainController';

app.get('/', mainController.index);

app.get('/aram', mainController.index);
app.post('/aram', mainController.sortAram);

app.get('/rift', mainController.indexRift);
app.post('/rift', mainController.sortRift);


export {app as indexRoutes}