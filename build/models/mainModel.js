"use strict";
exports.__esModule = true;
exports.model = void 0;
var parser_1 = require("../modules/parser");
var path = require("path");
var fs = require("fs");
var folder = path.resolve(__dirname, "../../src/data/");
var model = {
    // Enlistador de archivos
    tableLister: function () {
        var toSend = [];
        var fileArray = fs.readdirSync(folder).map(function (file, index) {
            var obj = {
                filename: "",
                ext: file ? path.extname(file).slice(1) : "",
                name: file.replace(/\.[^/.]+$/, ""),
                id: index
            };
            if (obj.ext == "csv" || obj.ext == "xls") {
                obj.filename = file;
            }
            return obj;
        });
        fileArray.forEach(function (file) {
            var exists = fs.existsSync(path.resolve(folder, "json", file.filename + ".json"));
            if (file.filename != "") {
                if (!fs.existsSync(path.resolve(folder, "json", file.filename.split(".")[0] + ".json"))) {
                    file.id = toSend.length;
                    toSend.push(file);
                }
            }
        });
        return model.order(toSend);
    },
    erase: function (extPath) {
        return fs.unlinkSync(path.resolve(folder, extPath));
    },
    // Conversor de todos los archivos a formato JSON
    allToJson: function (prevData) {
        var files = model.tableLister();
        var status;
        var json = [];
        files.forEach(function (file, index) {
            var obj = {
                data: [],
                ext: file.ext,
                id: model.jsonLister().length > 0
                    ? model.top(model.jsonLister()) + 1
                    : 0,
                name: files[index].name,
                com: "undefined"
            };
            // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
            if (file.ext == "csv") {
                obj.data = (0, parser_1.csvToJson)(path.resolve(folder, file.filename));
                model.erase(file.filename);
            }
            else if (file.ext == "xls") {
                obj.com = file.filename.split("-")[3] == "comision" ? file.filename.split("-")[4].toUpperCase() : "undefined";
                obj.data = (0, parser_1.xlsToJson)(path.resolve(folder, file.filename));
                model.erase(file.filename);
            }
            else {
                obj.ext = "Error";
            }
            obj.ext != "Error" ? json.push(obj) : "";
            var thisPath = path.resolve(folder, "json", obj.name + ".json");
            if (!fs.existsSync(thisPath)) {
                console.log("Creado un nuevo JSON -> " + obj.name + ".json");
                fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
                status = true;
            }
            else {
                status = false;
            }
        });
        return {
            data: json,
            status: status
        };
    },
    // Buscador de archivos (JSON)
    findJson: function (id) {
        var list = model.jsonLister();
        return list.find(function (j) { return j.id == id; });
    },
    // Listador de archivos JSON
    jsonLister: function () {
        var toSend = [];
        var fileArray = fs.readdirSync(folder + "/json/").map(function (file, index) {
            var fileExt;
            var filename;
            file ? (fileExt = path.extname(file).slice(1)) : "";
            if (fileExt == "json") {
                filename = file;
            }
            return filename;
        });
        if (fileArray.length > 0) {
            fileArray.forEach(function (file) {
                if (file) {
                    var json = JSON.parse(fs.readFileSync(path.resolve(folder, "json", file)));
                    toSend.push(json);
                }
            });
        }
        return model.order(toSend);
    },
    // Buscador de JSON por comisión
    findByCom: function (com) {
        var list = model.jsonLister();
        return list.filter(function (j) { return j.com.includes(com); });
    },
    top: function (array) {
        var top = 0;
        array.forEach(function (e) {
            if (e.id > top) {
                top = e.id;
            }
        });
        return top;
    },
    order: function (array) {
        var final = array.sort(function (a, b) {
            if (a.id > b.id) {
                return -1;
            }
            if (a.id < b.id) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        return final;
    },
    // Randomizador
    shuffle: function (array) {
        var _a;
        // Primera función para randomizar la lista
        var currentIndex = array.length, randomIndex;
        // El while hará la cuenta regresiva para ir cambiando los elementos
        while (currentIndex != 0) {
            // Escojo un elemento aleatorio
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // Y lo cambio por el elemento actual del index
            _a = [
                array[randomIndex],
                array[currentIndex],
            ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
        }
        return array;
    },
    // Guardador de JSON (obj to JSON), con buscador
    writeJson: function (obj, id) {
        var json = model.findJson(id);
        var thisPath = path.resolve(folder, "json", json.name + ".json");
        fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
        return obj;
    },
    // Lector de JSON (JSON to obj)
    readJson: function (id) {
        var json = model.findJson(id);
        var thisPath = path.resolve(folder, "json", json.name + ".json");
        return JSON.parse(fs.readFileSync(thisPath));
    },
    // Asignador de comisión (Con lector y guardador incorporados)
    assignCom: function (id, com) {
        var json = model.findJson(id);
        var thisPath = path.resolve(folder, "json", json.name + ".json");
        var obj = JSON.parse(fs.readFileSync(thisPath));
        obj.com = com != "undefined" ? com : "undefined";
        fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
        return obj;
    },
    // Buscador de JSON (sin conversor)
    one: function (id) {
        var json = model.findJson(id);
        return json;
    },
    // Editor de JSON para sumar una victoria a un alumno
    win: function (id, jsonId) {
        var obj = model.readJson(jsonId);
        var found = false;
        obj.data.map(function (a) {
            if (a.id == id) {
                a.wins++;
                found = true;
            }
        });
        if (found) {
            console.log("Tenemos un ganador");
        }
        else {
            console.log("No ha ganado nadie");
        }
        console.log("Reiniciando ruleta");
        model.writeJson(obj, jsonId);
        return obj;
    },
    // Procesador de formulario para crear la ruleta (lista a ruleta)
    processBody: function (data, id) {
        // Se encarga de procesar el body para la ruleta
        if (data.winner) {
            // Si hay un ganador, viene como primer dato del listado, asique lo elimino y le doy una victoria en su lista
            model.win(data.winner, id);
        }
        delete data.winner;
        var json = model.findJson(id).data; // Busco el json específico para traer la lista de alumnos
        var ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto
        var array = []; // Acumulador
        ids.forEach(function (a, i) {
            // Aquellos id que hayan llegado son los que estarán presentes, por lo que son los que debo buscar en el array de alumnos
            var id = parseInt(ids[i].split("for")[1]);
            array.push(json.find(function (al) { return al.id == id; }));
        });
        return array;
    }
};
exports.model = model;
//# sourceMappingURL=mainModel.js.map