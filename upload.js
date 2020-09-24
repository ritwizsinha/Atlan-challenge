const fs = require('fs');

const neatCsv = require('neat-csv');
const { getRunningTask, endRunningTask, endPausedTask, getPausedTask,
        runPausedTask, pauseRunningTask, addTask, getSkipLinesCount} = require('./utils/tasks');
const {addUser, rollbackNAddedUsers} = require('./utils/users');

const addPipedCsvToDatabase = (skipLinesCount, file) => {
        console.log("CSV FUNCTION CALLED");
        return new Promise(async (resolve, reject) => {
                const readStream = fs.createReadStream(`${__dirname}/${file}`, 'utf-8');
                try {
                        let counter = 0;
                        for await (const chunk of readStream) {
                                const data = await neatCsv(chunk);
                                for (const row of data) {
                                        counter++;
                                        if (counter <= skipLinesCount) continue;
                                        const runningTask = await getRunningTask();
                                        if (runningTask) {
                                                timeTakingLoop(2e9);    
                                                await addUser(row, runningTask);
                                        }
                                        else {
                                                const pausedTask = await getPausedTask();
                                                if (pausedTask) 
                                                        resolve("Paused");
                                                reject("Invalid task state in start");
                                        }
                                }
                        }
                        await endRunningTask();
                        resolve("Done completely");
                } catch(err) {
                        await endRunningTask();
                        reject(err);
                }
        })
}

const addTaskAndStartUpload = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        await addTask();
                        const msg = await addPipedCsvToDatabase(0, 'test.csv')
                        resolve(msg);
                } catch(e) {
                        reject(e);
                }
        })
}

const pauseUpload = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        await pauseRunningTask();
                        resolve("paused");
                } catch(err) {
                        console.log("Error happened");
                        reject(err);
                }
        })
}

const resumeTheUpload = () => {
        return new Promise(async(resolve, reject) => {
                try {
                        const {rowCount} = await getSkipLinesCount();
                        await runPausedTask();
                        const msg = await addPipedCsvToDatabase(rowCount, 'test.csv');
                        resolve(msg);
                } catch(err) {
                        console.log("Error happened");
                        reject(err);
                } 
        })
}

const stopPausedTask = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        const {rowCount} = await getSkipLinesCount();
                        if(rowCount) {
                                await rollbackNAddedUsers(rowCount);
                                await endPausedTask();
                                resolve()
                        } 
                        reject("No paused task found");
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