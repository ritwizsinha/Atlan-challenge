const express = require('express');
const app = express();
const cors  = require('cors');
app.use(cors());

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
})




app.listen(3000,'localhost');
