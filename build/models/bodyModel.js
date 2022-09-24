"use strict";
exports.__esModule = true;
exports.model = void 0;
// import { jsonLister as lister,  }
var path = require("path");
var fs = require("fs");
var folder = path.resolve(__dirname, "../../src/data/");
var model = {
    // Procesador de formulario para crear la ruleta (lista a ruleta)
    process: function (data, id) {
        // Se encarga de procesar el body para la ruleta
        if (data.winner) { // Si hay un ganador, viene como primer dato del listado, asique lo elimino y le doy una victoria en su lista
            model.win(data.winner, id);
        }
        delete data.winner;
        var json = model.readJson(id).data; // Busco el json específico para traer la lista de alumnos
        var ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto
        var array = []; // Acumulador
        ids.forEach(function (a, i) {
            // Aquellos id que hayan llegado son los que estarán presentes, por lo que son los que debo buscar en el array de alumnos
            var id = parseInt(ids[i].split("for")[1]);
            array.push(json.find(function (al) { return al.id == id; }));
        });
        return array;
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
    // Asignador de comisión (Con lector y guardador incorporados)
    assignCom: function (id, com) {
        var json = model.findJson(id);
        var thisPath = path.resolve(folder, "json", json.name + ".json");
        var obj = JSON.parse(fs.readFileSync(thisPath));
        obj.com = com != "undefined" ? com : "undefined";
        fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
        return obj;
    }
};
exports.model = model;
//# sourceMappingURL=bodyModel.js.map