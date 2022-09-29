"use strict";
exports.__esModule = true;
exports.indexRoutes = void 0;
var express = require("express");
var path = require("path");
var app = express.Router();
exports.indexRoutes = app;
var mainController_1 = require("../controllers/mainController");
app.get('/', mainController_1.mainController.index);
app.get('/aram', mainController_1.mainController.index);
app.post('/aram', mainController_1.mainController.sortAram);
app.get('/rift', mainController_1.mainController.indexRift);
app.post('/rift', mainController_1.mainController.sortRift);
//# sourceMappingURL=indexRoutes.js.map