"use strict";
exports.__esModule = true;
exports.model = void 0;
/*
import * as json from "./jsonModel"
import * as file from "./fileModel"
import * as body from "./bodyModel"
*/
var xlsParser = require("simple-excel-to-json"); // Requiero mi convertidor de xls a objeto
var csvToJson = require("convert-csv-to-json"); // Requiero mi convertidor de csv a objeto
var cleanse_1 = require("../modules/cleanse"); // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv
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
            ;
            return obj;
        });
        fileArray.slice().reverse().forEach(function (file, index) {
            var id = 0;
            if (file.filename != "") {
                file.id = toSend.length;
                toSend.push(file);
            }
            ;
        });
        return toSend;
    },
    // Conversor de un archivo a JSON
    allToJson: function () {
        var files = model.tableLister();
        var json = [];
        files.forEach(function (file, index) {
            var obj = {
                data: [],
                ext: file.ext,
                id: files[index].id,
                name: files[index].name
            };
            // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
            if (file.ext == "csv") {
                var partial = (0, cleanse_1.cleanse)(csvToJson.fieldDelimiter(",").getJsonFromCsv(path.resolve(folder, file.filename))); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
                obj.data = partial.map(function (a) { return a["Estudiante"].includes("Alumno") ? a.Nombre : ""; });
            }
            else if (file.ext == "xls") {
                var partial = xlsParser.parseXls2Json(path.resolve(folder, file.filename)).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
                obj.data = partial.map(function (a) { return a.Alumno.length > 0 ? a.Alumno : ""; });
            }
            else {
                obj.ext = "Error";
            }
            obj.ext != "Error" ? json.push(obj) : "";
        });
        return json;
    },
    // Aplicador de formato (Nombre y apellido)
    allParser: function () {
        // Consigo el formato (inestable) de "Nombre y apellido" independientemente del tipo de formato inicial
        var allToJson = model.allToJson();
        var parser = [];
        allToJson.forEach(function (file, index) {
            var thisFile = [];
            var obj = {
                data: [],
                id: allToJson[index].id,
                com: "",
                name: allToJson[index].name
            };
            for (var i = 0; i < file.data.length; i++) {
                var alumno = file.data[i];
                var item = {
                    id: i,
                    wins: 0,
                    name: ""
                };
                if (file.ext == "csv") {
                    // En la rúbrica, los nombres están con el formato de "Nombre1 Nombre2 Apellido1 Apellido2"
                    var separated = alumno.split(" "); // Obtengo el array de todas las palabras que conformen el nombre
                    if (separated.length == 2) {
                        // Si solo hay dos palabras, sería "Nombre y Apellido", lo dejo igual
                        item.name = separated[0] + " " + separated[1];
                    }
                    else if (separated.length >= 3) {
                        // Si hay 3 o mas, conservo la primera y tercera palabra (la cual puede fallar a la hora de dejar un nombre coherente, pero suele ser eficaz)
                        item.name = separated[0] + " " + separated[2];
                    }
                    else {
                        item.name = "Error";
                    }
                    ;
                }
                else if (file.ext == "xls") {
                    // Esta separación es mas sencilla, Apellidos y nombres están separados por una coma
                    var separated = alumno.split(", ");
                    if (alumno != "") {
                        item.name = separated[1].split(" ")[0] + " " + separated[0].split(" ")[0]; // Y ocupo el primero de cada uno
                    }
                    else {
                        item.name = "Error";
                    }
                    ;
                }
                else {
                    item.name = "Error";
                }
                ;
                item.name != "Error" ? obj.data.push(item) : "";
            }
            parser.push(obj);
        });
        return parser;
    },
    // Buscador de archivos (XLS, CSV)
    findFile: function (id) {
        var allParser = model.allParser();
        return allParser.find(function (file) { return file.id == id; });
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
            ;
            return filename;
        });
        if (fileArray.length > 0) {
            fileArray.forEach(function (file, index) {
                if (file) {
                    var json = JSON.parse(fs.readFileSync(path.resolve(folder, "json", file)));
                    toSend.push(json);
                }
                ;
            });
        }
        return toSend;
    },
    // Buscador de archivos (JSON)
    findJson: function (id) {
        var list = model.jsonLister();
        return list.find(function (j) { return j.id == id; });
    },
    // Buscador de JSON por comisión
    findByCom: function (com) {
        var list = model.jsonLister();
        return list.filter(function (j) { return j.com.includes(com); });
    },
    // Creador del JSON (y actualizador de su formato)
    saveJson: function (index) {
        var thisOne = model.findFile(index);
        var newObj = {
            data: thisOne.data,
            id: model.jsonLister().length,
            com: "undefined",
            name: thisOne.name
        };
        var thisPath = path.resolve(folder, "json", thisOne.name + ".json");
        if (!fs.existsSync(thisPath)) {
            fs.writeFileSync(thisPath, JSON.stringify(newObj, null, 2));
            return newObj;
        }
        else {
            console.log("El archivo ya existe, no se puede sobreescribir");
            console.log("Iniciando aplicación");
            var already = JSON.parse(fs.readFileSync(thisPath));
            return model.findJson(already.id);
        }
        ;
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
        if (data.winner) { // Si hay un ganador, viene como primer dato del listado, asique lo elimino y le doy una victoria en su lista
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
//# sourceMappingURL=modelsPort.js.map