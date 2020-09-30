
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

const { getRunningTask, endRunningTask, addTask, incrementTaskRowCount, taskPresent} = require('./utils/tasks');
const { getUserCount, getNthInSortedUser } = require('./utils/users');
const { action } = require("./constants/states");
const {SIMUL_TASK_NOT_ALLOWED, EXPORT_TERMINATED, EXPORT_COMPLETED} = require("./constants/messages");

const exportFromDatabaseToCsv = (startPoint, fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const size = await getUserCount();
      if(isNaN(size)) throw new Error("The size is not a number");
      for(let i = startPoint-1;i<size;i++) {
        try {
          const runningTask = await getRunningTask(action.EXPORT);
          if (!runningTask) { 
            await destroyExportFile();
            resolve({
              msg:EXPORT_TERMINATED
            });
          }
          takeTime(1e9);
          console.log(runningTask);
          const data = await getNthInSortedUser(i);
          await incrementTaskRowCount();
          new ObjectsToCsv([data[0].object]).toDisk(`${__dirname}/${fileName}`, {append: true});
        } catch(e) {}
      }
      await endRunningTask(action.EXPORT);
      resolve({
        msg:EXPORT_COMPLETED
      });
    }  catch(e) {
      reject(e);
    }
})
}

const startExport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await createExportFile();
      if(await taskPresent()) throw new Error(SIMUL_TASK_NOT_ALLOWED);
      await addTask(action.EXPORT);
      const msg = await exportFromDatabaseToCsv(1, 'data.csv');
      resolve({
        msg: msg
      });
    } catch (err) {
      reject(err);
    }
  })  
}

const stopExport = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await endRunningTask(action.EXPORT);
        await destroyExportFile();
        resolve({
          msg: EXPORT_TERMINATED
        });
      } catch (e) {
        reject(e);
      }
    })
}

const takeTime = (limit) => {
  let i = 0;
  while(i++<limit){} 
}

const createExportFile =  () => {
  return new Promise((resolve, reject) => {
    fs.writeFile('data.csv', ' ', (err) => {
      if(err) reject(err);
      resolve("File created");
    })  
  })
}

const destroyExportFile = () => {
  return new Promise((resolve, reject) => {
    fs.unlink(`${__dirname}/data.csv`, (err) => {
      if(err) reject(err)
      resolve("File Deleted");
    })
  })
}
module.exports = {
  startExport,
  stopExport
}