"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.model = void 0;
var node_fetch_1 = require("node-fetch");
var path = require("path");
var fs = require("fs");
var file = path.resolve(__dirname, "../../src/data/data.json");
var apikey = "RGAPI-d27bff60-183b-457f-8e03-f6a68a690961";
var urls = {
    champList: function () {
        return "http://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json";
    },
    masteries: function (id, apikey) {
        return "https://la2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/".concat(id, "?api_key=").concat(apikey);
    },
    summonner: function (name, apikey) {
        return "https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/".concat(name, "?api_key=").concat(apikey);
    }
};
var model = {
    read: function () {
        var data = fs.readFileSync(file);
        return JSON.parse(data);
    },
    list: function () {
        var iniData = model.read();
        var data = {
            list: iniData,
            length: iniData.length,
            total: 0
        };
        iniData.forEach(function (p) {
            data.total = data.total + p.lv;
        });
        return data;
    },
    champList: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, node_fetch_1["default"])(urls.champList()).then(function (data) { return data.json(); })["catch"](function (err) { return "error"; })];
            });
        });
    },
    findByName: function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = urls.summonner(name, apikey);
                return [2 /*return*/, (0, node_fetch_1["default"])(url).then(function (data) { return data.json(); })["catch"](function (err) { return "error"; })];
            });
        });
    },
    findMasteries: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, node_fetch_1["default"])(urls.masteries(id, apikey)).then(function (data) { return data.json(); })["catch"](function (err) { return "error"; })];
            });
        });
    },
    findBySummonerName: function (summoner) { return __awaiter(void 0, void 0, void 0, function () {
        var champList, player, mastery, acc_1, prop, newObj, finalItem_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model.champList()
                    //console.log(champList);
                ];
                case 1:
                    champList = _a.sent();
                    return [4 /*yield*/, model.findByName(summoner)
                        //console.log("player",player);
                    ];
                case 2:
                    player = _a.sent();
                    if (!player.id) return [3 /*break*/, 4];
                    return [4 /*yield*/, model.findMasteries(player.id)];
                case 3:
                    mastery = _a.sent();
                    acc_1 = [];
                    for (prop in champList.data) {
                        newObj = {
                            id: champList.data[prop].key,
                            name: champList.data[prop].name
                        };
                        acc_1.push(newObj);
                    }
                    finalItem_1 = [];
                    mastery.forEach(function (item) {
                        var newObj = {
                            campeon: acc_1.find(function (c) { return c.id == item.championId; }).name,
                            maestria: item.championLevel,
                            puntos: item.championPoints
                        };
                        finalItem_1.push(newObj);
                    });
                    return [2 /*return*/, finalItem_1];
                case 4: return [2 /*return*/, "El usuario ".concat(summoner, " no se encuentra")];
            }
        });
    }); },
    totalMastery: function (array) {
        var acc = 0;
        array.forEach(function (item) { return acc = acc + item.puntos; });
        return acc;
    },
    findJson: function (id) {
        return model.read().find(function (p) { return p.id == id; });
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
    sorting: function (mode, players) {
        //console.log(players); [1, 2, 9]
        if (players && players.length > 0) {
            var array = players.map(function (player) {
                return model.findJson(player);
            });
            // console.log(array);
            var finalObj = {
                teamOne: [],
                teamTwo: []
            };
            var initLv_1 = 0;
            array.forEach(function (item) { return initLv_1 = initLv_1 + item.lv; });
            var totalLv = initLv_1;
            var mult = 0;
            switch (array.length) {
                case 4:
                    break;
                default:
                    break;
            }
            var minLv = (totalLv / 2) * 0.95;
            console.log(minLv);
            var _loop_1 = function (i) {
                var intentoActual = model.shuffle(array);
                var equipoDos = intentoActual.slice(intentoActual.length / 2);
                var nivelEquipoDos = 0;
                equipoDos.forEach(function (item) { return nivelEquipoDos = nivelEquipoDos + item.lv; });
                var equipoUno = intentoActual.slice(0, intentoActual.length / 2);
                var nivelEquipoUno = 0;
                equipoUno.forEach(function (item) { return nivelEquipoUno = nivelEquipoUno + item.lv; });
                /*
                                if (i < 3) {
                                    console.log();
                                    
                                    console.log("Intento "+ (i + 1));
                                    console.log("nivelEquipoUno",nivelEquipoUno);
                                    console.log(equipoUno.map(p => p.name));
                                     
                                    
                                    console.log("nivelEquipoUno es mayor que minLv? "+ (nivelEquipoUno >= minLv));
                                    
                                    console.log("nivelEquipoDos",nivelEquipoDos);
                                    console.log(equipoDos.map(p => p.name));
                                    console.log("nivelEquipoDos es mayor que minLv? "+ (nivelEquipoDos >= minLv));
                                    console.log();
                                    
                                }*/
                if (nivelEquipoUno == 8 || nivelEquipoDos == 8) {
                    console.log("Coincidencia en el " + (i + 1) + " intento");
                    console.log("nivelEquipoUno", nivelEquipoUno);
                    console.log(equipoUno.map(function (p) { return p.name; }));
                    console.log("nivelEquipoDos", nivelEquipoDos);
                    console.log(equipoDos.map(function (p) { return p.name; }));
                    return { value: finalObj = {
                            teamOne: equipoUno,
                            teamTwo: equipoDos
                        } };
                }
                /*
                                if (nivelEquipoUno >= minLv && nivelEquipoDos >= minLv) {
                                    console.log("Coincidencia en el " + ( i + 1 ) + " intento");
                                    console.log("nivelEquipoUno",nivelEquipoUno);
                                    console.log(equipoUno.map(p => p.name));
                                    console.log("nivelEquipoDos",nivelEquipoDos);
                                    console.log(equipoDos.map(p => p.name));
                                    return finalObj = {
                                        teamOne: equipoUno,
                                        teamTwo: equipoDos
                                    }
                                }*/
                if (i == 99998) {
                    console.log("Error");
                }
            };
            for (var i = 0; i < 99999; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return finalObj;
        }
        else {
            return "No se han seleccionado jugadores";
        }
    }
};
exports.model = model;
//# sourceMappingURL=mainModel.js.map