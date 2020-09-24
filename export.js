
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

const { userModel } = require('./models/users');
const { getRunningTask, endRunningTask, endPausedTask, getPausedTask,
  runPausedTask, pauseRunningTask, addTask, getSkipLinesCount, incrementTaskRowCount} = require('./utils/tasks');

const { getUserCount, getNthInSortedUser } = require('./utils/users');
const exportFromDatabaseToCsv = (startPoint, fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const size = await getUserCount();
      if(isNaN(size)) throw new Error("The size is not a number");
      for(let i = startPoint-1;i<size;i++) {
        const runningTask = await getRunningTask();
        console.log(runningTask);
        if (!runningTask) { 
          await destroyExportFile();
          resolve("Export terminated");
        }
        takeTime(1e9);
        const data = await getNthInSortedUser(i);
        await incrementTaskRowCount();
        new ObjectsToCsv([data[0].object]).toDisk(`${__dirname}/${fileName}`, {append: true});
      }
      await endRunningTask();
      resolve("Export Done");
    }  catch(e) {
      reject(e);
    }
})
}

const startExport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await createExportFile()
      await addTask();
      const msg = await exportFromDatabaseToCsv(1, 'data.csv');
      resolve(msg);
    } catch (err) {
      reject(err);
    }
  })  
}

const stopExport = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await endRunningTask();
        await destroyExportFile();
        resolve("Export terminated");
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