const router = require('express').Router();

const { addTaskAndStartUpload, changeRunningTaskStatusToPause } = require('./worker');

router.get("/upload/start", async (req, res, next) => {
    try {
        const msg = await addTaskAndStartUpload();
        res.send(msg);
    } catch(err) {
        next(err);
    }
})

router.get("/upload/pause", async (req, res, next) => {
    try {
        const msg = await changeRunningTaskStatusToPause();
        res.send(msg);
    } catch (err) {
        next(err)
    }
})

router.get('/', (req, res, next) => {
    console.log("Request received"); 
    res.sendFile(__dirname + '/index.html');
})


module.exports = {
    router
}