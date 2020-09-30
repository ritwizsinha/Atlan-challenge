const fs = require('fs');
const neatCsv = require('neat-csv');

const { getRunningTask, endRunningTask, endPausedTask, getPausedTask,
        runPausedTask, pauseRunningTask, addTask, getSkipLinesCount, taskPresent } = require('./utils/tasks');
const { addUser, rollbackNAddedUsers } = require('./utils/users');
const { action } = require('./constants/states');
const { SIMUL_TASK_NOT_ALLOWED, NO_PAUSED_TASK, UPLOAD_FINISHED, TASK_PAUSED_SUCCESSFULLY, TASK_STOPPED_SUCCESSFULLY } = require("./constants/messages");

const addPipedCsvToDatabase = (skipLinesCount, file) => {
        return new Promise(async (resolve, reject) => {
                const readStream = fs.createReadStream(`${__dirname}/${file}`, 'utf-8');
                try {
                        let counter = 0;
                        for await (const chunk of readStream) {
                                const data = await neatCsv(chunk);
                                for (const row of data) {
                                        counter++;
                                        if (counter <= skipLinesCount) continue;
                                        try {
                                                const runningTask = await getRunningTask(action.UPLOAD);
                                                if (runningTask) {
                                                        console.log(runningTask);
                                                        timeTakingLoop(1e9);    
                                                     await addUser(row, runningTask); 
                                                }
                                                else {
                                                        const pausedTask = await getPausedTask(action.UPLOAD);
                                                        if (pausedTask) 
                                                                resolve({
                                                                        msg: TASK_PAUSED_SUCCESSFULLY
                                                                });
                                                        reject("Invalid task state in start");
                                                }
                                        } catch(e) {}
                                }
                        }
                        const msg = await endRunningTask(action.UPLOAD);
                        resolve({
                                msg: UPLOAD_FINISHED
                        });
                } catch(err) {
                        reject(err);
                }
        })
}

const addTaskAndStartUpload = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        if(await taskPresent()) reject(SIMUL_TASK_NOT_ALLOWED);
                        await addTask(action.UPLOAD);
                        const {msg} = await addPipedCsvToDatabase(0, 'test.csv')
                        resolve({
                                msg
                        });
                } catch(e) {
                        reject(e);
                }
        })
}

const pauseUpload = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        await pauseRunningTask(action.UPLOAD);
                        resolve({
                                msg: TASK_PAUSED_SUCCESSFULLY
                        });
                } catch(err) {
                        reject(err);
                }
        })
}

const resumeTheUpload = () => {
        return new Promise(async(resolve, reject) => {
                try {
                        const rowCount = Number(await getSkipLinesCount());
                        await runPausedTask(action.UPLOAD);
                        const {msg} = await addPipedCsvToDatabase(rowCount, 'test.csv');
                        resolve({
                                msg
                        });
                } catch(err) {
                        reject(err);
                } 
        })
}

const stopPausedTask = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        const rowCount = Number(await getSkipLinesCount());
                        if (rowCount) {
                                await rollbackNAddedUsers(rowCount);
                                await endPausedTask(action.UPLOAD);
                                resolve({
                                        msg: TASK_STOPPED_SUCCESSFULLY
                                });
                        } 
                        reject({
                                msg:NO_PAUSED_TASK
                        });
                } catch(err) {
                        reject(err);
                }
        })
}

const timeTakingLoop = (limit) => {
        let  i=0;
        while(i<limit) i++;
}

module.exports = {
        addTaskAndStartUpload,
        pauseUpload,
        resumeTheUpload, 
        stopPausedTask,
}