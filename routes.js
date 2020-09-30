const router = require('express').Router();
const { addTaskAndStartUpload, pauseUpload
        ,stopPausedTask, resumeTheUpload } = require('./upload');

const  { startExport, stopExport } = require('./export');
const {EXPORT_COMPLETED} = require("./constants/messages");
router.get("/upload/start", async (req, res, next) => {
    try {
        const {msg} = await addTaskAndStartUpload();
        res.status(200)
        res.send(msg);
    } catch(err) {
        next(err);
    }
})

router.get("/upload/pause", async (req, res, next) => {
    try {
        const {msg} = await pauseUpload();
        res.status(200)
        res.send(msg);
    } catch (err) {
        next(err)
    }
})


router.get("/upload/resume", async (req, res, next) => {
    try {
        const {msg} = await resumeTheUpload();
        res.status(200)
        res.send(msg);
    } catch (err) {
        next(err)
    }
})


router.get("/upload/stop", async (req, res, next) => {
    try {
        const {msg} = await stopPausedTask();
        res.status(200)
        res.send(msg);
    } catch (err) {
        next(err)
    }
})

router.get('/export/start', async (req, res, next) => {
    try {
        const {msg} = await startExport();
        if(msg.msg === EXPORT_COMPLETED) {
            res.status(200)
            res.sendFile(`${__dirname}/data.csv`);
        } else{ 
            res.status(200);
            res.send(msg);
        }
    } catch (e) {
        next(e);
    }
})

router.get('/export/stop', async (req, res, next) => {
    try {   
        const msg = await stopExport();
        res.status(200);
        res.send(msg);
    } catch (e) {
        next(e);
    }
})

module.exports = {
    router
}