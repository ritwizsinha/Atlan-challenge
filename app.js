const express = require('express');
const cors  = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { MONGO_URI } = require('./constants/urls');
const { router } = require('./routes');

mongoose.connect("mongodb://mongo:27017/atlan").then(() => {
    console.log("Connected Successfuly");
});
const db = mongoose.connection;

const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use((err,req,res,next)=>{
    console.error(err)
    res.status(500)
	res.send({err:err.message})
})
app.listen(PORT, () => {
    console.log(`Connection successful to ${PORT}`);
});
