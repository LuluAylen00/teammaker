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
    sorting: (mode, players) => {
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
            let mult = 0
            switch (array.length) {
                case 4:
                    
                    break;
            
                default:
                    break;
            }
            let minLv = (totalLv / 2) * 0.95;
            console.log(minLv); 

            for (let i = 0; i < 99999; i++) {
                let intentoActual = model.shuffle(array)
                let equipoDos = intentoActual.slice(intentoActual.length / 2)
                let nivelEquipoDos = 0;
                equipoDos.forEach(item => nivelEquipoDos = nivelEquipoDos + item.lv);
                
                let equipoUno = intentoActual.slice(0, intentoActual.length / 2)
                let nivelEquipoUno = 0;
                equipoUno.forEach(item => nivelEquipoUno = nivelEquipoUno + item.lv);
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

                if(nivelEquipoUno == 8 || nivelEquipoDos == 8){
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
            }


            return finalObj
        } else {
            return "No se han seleccionado jugadores"
        }
    }
};

export { model };
