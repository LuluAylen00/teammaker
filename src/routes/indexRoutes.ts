import * as express from "express";
const path = require("path");
const app = express.Router();
import {mainController} from '../controllers/mainController';

app.get('/', mainController.index);

app.post('/aram', mainController.sort);


export {app as indexRoutes}