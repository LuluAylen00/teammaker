const path = require("path");
const fs = require("fs");
let file = path.resolve(__dirname, "../../src/data/data.json");

const model = {
    read: () => {
        fs.readFileSync()
    }
};

export { model };
