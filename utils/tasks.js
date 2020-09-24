const { promisify } = require('util')
const redis = require('redis');

const { taskState } = require('../constants/states');

const REDIS_URL = process.env.REDIS_URL ? process.env.REDIS_URL : 6379;
const redis_client = redis.createClient(REDIS_URL)
redis_client.on("error", function(error) {
    console.error(error);
});

const get = promisify(redis_client.get).bind(redis_client);
const flushAll = promisify(redis_client.flushall).bind(redis_client);
const setex = promisify(redis_client.setex).bind(redis_client);
const exists = promisify(redis_client.exists).bind(redis_client);
const set = promisify(redis_client.set).bind(redis_client);

const task = "Task";
const rowCount = "RowCount";
const getRunningTask = async () => {
    if(await exists(task)) {
      const status = Number(await get(task));
      if(status === taskState.RUNNING) {
       return await get(rowCount);
      }
    } 
    throw new Error("No running task");
}

const endRunningTask = async () => {
  if(await exists(task)) {
      const status = Number(await get(task));
      if(status === taskState.RUNNING) {
        await flushAll();
        return ;
      }
  }
    throw new Error("No Running Task");
}

const endPausedTask = async () => {
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
      await flushAll();
      return;
   }
  }
  throw new Error("No Paused Task");
}

const getPausedTask = async () => {
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
      return await get(rowCount);
    }
  }
  throw new Error("No Paused Task");
}
const runPausedTask = async () => {
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
     await set(task,taskState.RUNNING);
      return;
   }
  }
  throw new Error("No Paused Task");
}

const pauseRunningTask = async () => {
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.RUNNING) {
      await set(task, taskState.PAUSED);
      return;
    }
  }
}

const addTask = async () => {
  try {
      await setex(task, 3600, taskState.RUNNING);
      await setex(rowCount, 3600, 0);
    } catch(err) {
      console.log(err);
    }
}


const getSkipLinesCount = async () => {
  if(exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED)
    return await get(rowCount);
  }
  throw new Error("No Paused Task found");
}

const incrementTaskRowCount = async () => {
  if(await exists(rowCount)) {
    const size = Number(await get(rowCount));
    await set(rowCount,size + 1);
  }
}
module.exports = {
  getRunningTask,
  endRunningTask,
  endPausedTask,
  getPausedTask,
  runPausedTask,
  pauseRunningTask,
  addTask,
  getSkipLinesCount,
  incrementTaskRowCount
}