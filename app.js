const express = require('express');
const cors  = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');

const { MONGO_URI } = require('./constants/urls');
const { router } = require('./routes');

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => {
    console.log("Connected successfully")
});

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
