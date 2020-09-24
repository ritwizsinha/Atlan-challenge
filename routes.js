const router = require('express').Router();
const { addTaskAndStartUpload, pauseUpload
        ,stopPausedTask, resumeTheUpload } = require('./upload');

const  { startExport, stopExport } = require('./export');

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
        const msg = await pauseUpload();
        res.send(msg);
    } catch (err) {
        next(err)
    }
})


router.get("/upload/resume", async (req, res, next) => {
    try {
        const msg = await resumeTheUpload();
        res.send(msg);
    } catch (err) {
        next(err)
    }
})


router.get("/upload/stop", async (req, res, next) => {
    try {
        const msg = await stopPausedTask();
        res.send(msg);
    } catch (err) {
        next(err)
    }
})

router.get('/export/start', async (req, res, next) => {
    try {
        const msg = await startExport();
        if(msg === "Export Done") {
            console.log("Goes here again");
            res.sendFile(`${__dirname}/data.csv`);
        } else
        res.send(msg);
    } catch (e) {
        next(e);
    }
})

router.get('/export/stop', async (req, res, next) => {
    try {   
        const msg = await stopExport();
        res.send(msg);
    } catch (e) {
        next(e);
    }
})

router.get('/', (req, res, next) => {
    console.log("Request received"); 
    res.sendFile(__dirname + '/index.html');
})

module.exports = {
    router
}