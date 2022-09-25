import {model} from "../models/mainModel";

let mainController = {
    index: async (req, res) => {
        let data = model.list();
        let acc//= await model.findBySummonerName("Hide On Kyojuro")
        //console.log(acc);
        /* if (!acc.includes("no se encuentra")) {
            //console.log(model.totalMastery(acc));
        } */
        
        res.render('homepage', {data, acc});
    },
    sort: (req, res) => {
        
        model.sorting(req.body.mode, req.body.players);
        

        res.redirect('/');
    },
    
}

export {mainController}