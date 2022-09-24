"use strict";
exports.__esModule = true;
exports.mainController = void 0;
var mainModel_1 = require("../models/mainModel");
var mainController = {
    index: function (req, res) {
        res.render('homepage');
    },
    toConvertList: function (req, res) {
        var files = mainModel_1.model.tableLister();
        res.render('toConvert', { files: files });
    },
    uploadTable: function (req, res) {
        console.log("Fichero", req.file.originalname, "subido");
        res.redirect('/convert');
    },
    convertThis: function (req, res) {
        var result = mainModel_1.model.allToJson();
        if (result.status) {
            return res.redirect('/list');
        }
        else {
            var data = mainModel_1.model.readJson(result.data.shift().id);
            return res.render("takeList", { data: data });
        }
    },
    jsonList: function (req, res) {
        var json = mainModel_1.model.jsonLister();
        if (json.length > 0) {
            res.render('jsonList', { data: json });
        }
        else {
            res.send("No hay documentos JSON");
        }
    },
    jsonDetail: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        return res.render("takeList", { data: data, com: req.params.id });
    },
    erase: function (req, res) {
        var data = mainModel_1.model.findJson(req.params.id);
        mainModel_1.model.erase("json/" + data.name + ".json");
        return res.redirect("/list");
    },
    assignCom: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        var edit = mainModel_1.model.assignCom(req.params.id, req.body.adjust);
        return res.redirect('/view/' + req.params.id);
    },
    unassignCom: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        var edit = mainModel_1.model.assignCom(req.params.id, "undefined");
        return res.redirect('/view/' + req.params.id);
    },
    iRoulette: function (req, res) {
        var data = mainModel_1.model.processBody(req.body, req.params.id); // Recibo el dato de los participantes de la ruleta y los guardo
        data = mainModel_1.model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data, com: req.params.id }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    comList: function (req, res) {
        var json = mainModel_1.model.jsonLister();
        var query = req.query.com ? req.query.com : "";
        if (req.query.com) {
            json = mainModel_1.model.findByCom(query);
        }
        ;
        if (json.length > 0) {
            res.render('listByCom', { data: json, query: query });
        }
        else {
            res.send("No hay documentos JSON");
        }
        ;
    },
    groupsIndex: function (req, res) {
        var groups;
        //req.src.origin == "Google" ? groups = model.groupFinder(req.src) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
    }
};
exports.mainController = mainController;
//# sourceMappingURL=mainController.js.map