import fetch from 'node-fetch';
import mongoose from 'mongoose';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


const templatePath = path.join(__dirname, "../views");

console.log(templatePath);
app.set("view engine", "hbs");
app.get('/getData', async (req, res) => {
    const data = await Crypto.find();
    res.send(data);
    console.log(data);
})
app.get('/', async (req, res) => {
    const data = await Crypto.find();
    console.log(data);
    res.render('index');
})

mongoose.connect('mongodb://localhost:27017/QuadBFreshers', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
})
    .then(() => console.log("Connection succesfull"))
    .catch((err) => console.log(err));

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    buy: {
        type: String,
        required: true
    },
    sell: {
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    base_unit: {
        type: String,
        required: true
    }
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

async function getData() {
    const data = await Crypto.find();
    console.log(data);
}
async function getPosts() {
    const data = await fetch("https://api.wazirx.com/api/v2/tickers");
    const responseData = await data.json();
    // console.log(Object.keys(responseData).length);
    const len = Object.keys(responseData).length;

    for (let i = 0; i < 10; i++) {
        // console.log(Object.values(responseData)[i].name);
        const newcrypto = new Crypto({
            name: Object.values(responseData)[i].name,
            last: Object.values(responseData)[i].last,
            buy: Object.values(responseData)[i].buy,
            sell: Object.values(responseData)[i].sell,
            volume: Object.values(responseData)[i].volume,
            base_unit: Object.values(responseData)[i].base_unit
        });
        newcrypto.save();
    }
    const response = responseData.btcinr;
}
app.listen(8000, () => {
    console.log("Connection success");
})
getPosts();