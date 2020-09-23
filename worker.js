const mongoose =require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const { taskModel } = require('./models/tasks');
const { userModel } = require('./models/users');
const { uploadState, taskState } = require('./constants/states');
const neatCsv = require('neat-csv');

// mongoose.startSession()
// .then((session) => {
//     session.startTransaction();
//     try {
//         await addNewTask();
//         pipeCSVfrom(0, msg.file, session);
//     } catch(e) {
//         process.send("Some error occured");
//         session.abortSession();
//         process.exit();
//     }
// })

const addPipedCsvToDatabase = (skipLinesCount, file) => {
        console.log("CSV FUNCTION CALLED");
        return new Promise(async (resolve, reject) => {
                const readStream = fs.createReadStream(`${__dirname}/${file}`, 'utf-8');
                try {
                        for await (const chunk of readStream) {
                                const data = await neatCsv(chunk);
                                for (const row of data) {
                                        console.log(row);
                                        const runningTask = await getRunningTask();
                                        if (runningTask) {
                                                timeTakingLoop(5e9);    
                                                await addUser(row, runningTask);
                                        }
                                        else {
                                                const pausedTask = await getPausedTask();
                                                if (pausedTask) {
                                                        resolve("Paused");
                                                }
                                                const count = get
                                                await rollbackNAddedUsers();
                                                reject("Ended");
                                        }
                                }
                        }
                        resolve("Done completely");
                        await removeRunningTask();
                } catch(err) {
                        reject(err);
                        await removeRunningTask();
                }
        })
}

const getRunningTask = async () => {
        return await taskModel.findOne({status: taskState.RUNNING}).exec();
}

const removeRunningTask = async () => {
        await taskModel.deleteMany({status: taskState.RUNNING}).exec();
}

const getPausedTask = async () => {
        return await taskModel.findOne({status: taskState.PAUSED}).exec();
}

const addUser = async (obj, runningTask) => {
        // console.log(obj);
        await incrementTaskRowCount(runningTask);
        return await userModel.create({
                object: obj
        })
}
const timeTakingLoop = (limit) => {
        let  i=0;
        while(i<limit) i++;
}

const incrementTaskRowCount = async (runningTask) => {
        return await taskModel.updateOne({_id: runningTask._id},{$set: {rowCount: (runningTask.rowCount +1)}}).exec();
}

const rollbackNAddedUsers = async (n) => {
        const data =  await  userModel.find().sort({timestamp:-1}).limit(n);
        console.log(data);
}

const pauseRunningTask = async () => {
        await taskModel.updateOne({status: taskState.RUNNING}, {$set: {status: taskState.PAUSED}}).exec();
}
// const incrementTaskRowCount = async (runningTask) => {
//     await taskModel.updateOne({_id: runningTask._id}, {$set: {rowCount: runningTask.rowCount+1}});
// }

// const addNewTask = async () => {
//     const newTask =  new taskModel({
//         status: taskState.RUNNING,
//         threadId: process.pid,
//         rowCount: 0,
//     });
//     await newTask.save();
// }

// process.on("message", (msg) => {
//     console.log(msg.func);
//     // msg.then(res => console.log(res));
// })

// const createSessionAndUploadData = async () => {
//     const 
// }
const addTask = async () => {
        await taskModel.create({
                status: taskState.RUNNING,
                rowCount: 0
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

const changeRunningTaskStatusToPause = () => {
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

module.exports = {
        addTaskAndStartUpload,
        changeRunningTaskStatusToPause,
}