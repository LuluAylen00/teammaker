import {model} from "../models/mainModel";

let mainController = {
    index: (req, res) => {
        res.render('homepage');
    },
    sort: (req, res) => {
        res.render('homepage');
    },
}

export {mainController}