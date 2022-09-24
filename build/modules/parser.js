"use strict";
exports.__esModule = true;
exports.xlsToJson = exports.csvToJson = void 0;
var xlsParser = require("simple-excel-to-json"); // Requiero mi convertidor de xls a objeto
var csvParser = require("convert-csv-to-json"); // Requiero mi convertidor de csv a objeto
var cleanse_1 = require("./cleanse"); // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv
var csvToJson = function (path) {
    var data = [];
    var partial = (0, cleanse_1.cleanse)(csvParser.fieldDelimiter(",").getJsonFromCsv(path)); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
    var filter = partial.map(function (a) {
        return {
            name: a["Estudiante"].includes("Alumno") ? a.Nombre : "",
            group: a["Estudiante"].includes("Alumno") ? a.Grupo : undefined
        };
    });
    for (var i = 0; i < filter.length; i++) {
        var alumno = filter[i];
        var item = {
            id: i,
            wins: 0,
            name: "",
            group: alumno.group
        };
        var separated = alumno.name.split(" "); // Obtengo el array de todas las palabras que conformen el nombre
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
        data.push(item);
    }
    return data;
};
exports.csvToJson = csvToJson;
var xlsToJson = function (path) {
    var data = [];
    var partial = xlsParser.parseXls2Json(path).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
    var filter = partial.map(function (a) {
        return {
            name: a.Alumno.length > 0 ? a.Alumno : "",
            group: undefined
        };
    });
    for (var i = 0; i < filter.length; i++) {
        var alumno = filter[i];
        var item = {
            id: i,
            wins: 0,
            name: "",
            group: alumno.group
        };
        // Esta separación es mas sencilla, Apellidos y nombres están separados por una coma
        var separated = alumno.name.split(", ");
        if (alumno.name != "") {
            item.name = separated[1].split(" ")[0] + " " + separated[0].split(" ")[0]; // Y ocupo el primero de cada uno
        }
        else {
            item.name = "Error";
        }
        ;
        if (item && item.name != "Error") {
            data.push(item);
        }
    }
    return data;
};
exports.xlsToJson = xlsToJson;
//# sourceMappingURL=parser.js.map