import {model} from "../models/mainModel";

let mainController = {
    index: async (req, res) => {
        let data = model.list();
        let lista = null
        /*let acc= await model.findBySummonerName("Hide On Walls")
        console.log(acc);
        if (!acc.includes("no se encuentra")) {
            console.log(model.totalMastery(acc));
        } */
        
        res.render('exampleAram', {data, lista});
    },
    indexRift: async (req, res) => {
        let data = model.list();
        let lista = null
        /*let acc= await model.findBySummonerName("Hide On Walls")
        console.log(acc);
        if (!acc.includes("no se encuentra")) {
            console.log(model.totalMastery(acc));
        } */
        
        res.render('exampleRift', {data, lista});
    },
    sortAram: (req, res) => {
        let data = model.list();

        let lista = model.sorting(req.body.players);
        
        res.render('exampleAram', {data, lista});
    },
    sortRift: (req, res) => {
        let data = model.list();
        let lista = model.sortRift(req.body.mode,req.body.players);

        res.render('exampleRift', {data, lista});
    }
    
}

export {mainController}