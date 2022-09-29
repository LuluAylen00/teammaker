import { response } from "express";
import fetch from "node-fetch";
const path = require("path");
const fs = require("fs");
let file = path.resolve(__dirname, "../../src/data/data.json");

let apikey = "RGAPI-d27bff60-183b-457f-8e03-f6a68a690961"

let urls = {
    champList: () => {
        return "http://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json"
    },
    masteries: (id, apikey) => {
        return `https://la2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${apikey}`
    },
    summonner: (name, apikey) => {
        return `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apikey}`
    }
}

const model = {
    read: () => {
        let data = fs.readFileSync(file)
        return JSON.parse(data);
    },
    list: () => {
        let iniData = model.read()
        let data = {
            list: iniData,
            length: iniData.length,
            total: 0
        }
        iniData.forEach((p) => {
            data.total = data.total + p.lv
        })
        return data
    },
    champList: async function(){
        return fetch(urls.champList()).then((data) => data.json()).catch((err) => { return "error" })
    },
    findByName: async function(name){
        let url = urls.summonner(name, apikey)
        return fetch(url).then((data) => data.json()).catch((err) => { return "error" })
    },
    findMasteries: async function(id){
        return fetch(urls.masteries(id, apikey)).then((data) => data.json()).catch((err) => { return "error" })
    },
    findBySummonerName: async (summoner) => {
        let champList = await model.champList()
        //console.log(champList);
        
        let player = await model.findByName(summoner)
        //console.log("player",player);
        
        if (player.id) {
           // console.log("Todo ok");
            
            var mastery = await model.findMasteries(player.id)

            let acc = []
            
            for (const prop in champList.data) {
                let newObj = {
                    id: champList.data[prop].key,
                    name: champList.data[prop].name,
                }
                acc.push(newObj);
            }
            //console.log(acc);  // { id: '121', name: "Kha'Zix" }
            
            // console.log(mastery); // [ { championId: 59, championLevel: 2, championPoints: 5161 } ]

            let finalItem = []
            mastery.forEach((item) => {
                let newObj = {
                    campeon: acc.find(c => c.id == item.championId).name,
                    maestria: item.championLevel,
                    puntos: item.championPoints
                }
                finalItem.push(newObj)
            })
            return finalItem;
        } else {
            return `El usuario ${summoner} no se encuentra`
        }
    },
    totalMastery: function(array){
        let acc = 0
        array.forEach(item => acc = acc + item.puntos)
        return acc
    },
    findJson: (id) => {
        return model.read().find(p => p.id == id);
    },
    // Randomizador
    shuffle: (array) => {
        // Primera función para randomizar la lista
        let currentIndex = array.length,
            randomIndex;
        // El while hará la cuenta regresiva para ir cambiando los elementos
        while (currentIndex != 0) {
            // Escojo un elemento aleatorio
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // Y lo cambio por el elemento actual del index
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    },
    sortRift: (mode, players) => {
        //console.log(players); [1, 2, 9]
        if (players && players.length > 0) {
            let array = players.map(player => {
                return model.findJson(player)
            })
            // console.log(array);
            
            let finalObj : object
/*
            let initLv = 0;
            array.forEach(item => initLv = initLv + item.lv);
            let totalLv = initLv;

            // 23 -> 0.95
            // 20 -> 0.9
            // 10 -> 0.88
            //
            //

            let minLv = totalLv * 0.9 / 2;
            console.log(totalLv);
            console.log(minLv); */

            const levelCounter = function (team){
                let acc = 0
                team.forEach((p) => {
                    acc = acc + p.lv
                })
                return acc 
            }
            
            for (let i = 0; i < 99999; i++) {
                let shuffle = model.shuffle(array)
                let thisTry = {
                    teamOne: {
                        roster: model.assignMod(shuffle.slice(0, shuffle.length / 2)),
                        lv: 0
                    },
                    teamTwo: {
                        roster: model.assignMod(shuffle.slice(shuffle.length / 2)),
                        lv: 0
                    }
                }
                thisTry.teamOne.lv = levelCounter(thisTry.teamOne.roster)
                thisTry.teamTwo.lv = levelCounter(thisTry.teamTwo.roster)
                
                if (i < 2) {/*
                    console.log(thisTry.teamOne);
                    console.log(thisTry.teamTwo);*/
                    console.log(thisTry.teamOne.lv + thisTry.teamTwo.lv);
                    console.log("thisTry.teamOne.lv",thisTry.teamOne.lv);
                            console.log(thisTry.teamOne.roster.map(p => p.name));
                            console.log("thisTry.teamTwo.lv",thisTry.teamTwo.lv);
                            console.log(thisTry.teamTwo.roster.map(p => p.name));
                }

                let minLv = (thisTry.teamOne.lv + thisTry.teamTwo.lv) / 2 * 0.95

                if (thisTry.teamOne.lv >= minLv && thisTry.teamTwo.lv >= minLv) {

                    if ((thisTry.teamOne.roster.length >= thisTry.teamTwo.roster.length && thisTry.teamOne.lv <= thisTry.teamTwo.lv ) || (thisTry.teamTwo.roster.length >= thisTry.teamOne.roster.length && thisTry.teamTwo.lv <= thisTry.teamOne.lv )) {
                            console.log("Coincidencia en el " + ( i + 1 ) + " intento");
                            console.log("thisTry.teamOne.lv",thisTry.teamOne.lv);
                            console.log(thisTry.teamOne.roster.map(p => p.name));
                            console.log("thisTry.teamTwo.lv",thisTry.teamTwo.lv);
                            console.log(thisTry.teamTwo.roster.map(p => p.name));
                            return finalObj = {
                            teamOne: thisTry.teamOne.roster,
                            teamTwo: thisTry.teamTwo.roster
                        }
                    }
                }

                if (i == 99998) {
                    console.log("Error");
                    
                }

            }
            return finalObj
        } else {
            return "No se han seleccionado jugadores"
        }
    },
    assignMod: (team) => {
        const mod = function (assignedRole,playerRoles){
            // assignedRole = rol que le toca al jugador
            // playerRoles = listado de roles por comodidad del jugador
            let refObj = {
                0: 1.4,
                1: 1.2,
                2: 1,
                3: 0.8,
                4: 0.6
            }
            //   0  |  1  |  2  |  3  |  4
            //  1.4 | 1.2 |  1  | 0.8 | 0.6
            let value = 1
            playerRoles.forEach((role, index) => {
                if(role == assignedRole){
                    value =  refObj[index]
                }
            })
            //console.log("previa",assignedRole,playerRoles);
            
            return value
        }
        let size = team.length
        let lanes = []
        switch (size) {
            case 2:
                lanes = ["top", "mid"]
                break;
            case 3:
                lanes = ["top", "mid", "adc"]
                break;
            case 4:
                lanes = ["top", "jg", "mid", "adc"]
                break;
            case 5:
                lanes = ["top", "jg", "mid", "adc", "sup"]
                break;
            default:
                lanes = ["mid"]
                break;
        }
        let acc = []
        team.forEach((player,index) => { // lanes[index] = posición asignada en el equipo
            let newObj = {
                name: player.name,
                role: lanes[index],
                lv: player.lv * mod(lanes[index], player.lineas),
                summonner: player.invocador
            }
            acc.push(newObj)
        })
        return acc
    },
    sorting: (players) => {
        //console.log(players); [1, 2, 9]
        if (players && players.length > 0) {
            let array = players.map(player => {
                return model.findJson(player)
            })
            // console.log(array);
            let finalObj = {
                teamOne: [],
                teamTwo: []
            }

            let initLv = 0;
            array.forEach(item => initLv = initLv + item.lv);
            let totalLv = initLv;
            
            let minLv = (totalLv / 2) * 1;
            console.log(minLv); 

            for (let i = 0; i < 99999; i++) {
                let intentoActual = model.shuffle(array)
                let equipoDos = intentoActual.slice(intentoActual.length / 2)
                let nivelEquipoDos = 0;
                equipoDos.forEach(item => nivelEquipoDos = nivelEquipoDos + item.lv);
                
                let equipoUno = intentoActual.slice(0, intentoActual.length / 2)
                let nivelEquipoUno = 0;
                equipoUno.forEach(item => nivelEquipoUno = nivelEquipoUno + item.lv);

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
                }

                if (i == 99998) {
                    console.log("Error");
                    
                }
            }


            return finalObj
        } else {
            return "No se han seleccionado jugadores"
        }
    }
};

export { model };
