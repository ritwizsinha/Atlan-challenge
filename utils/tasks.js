const { promisify } = require('util')
const redis = require('redis');

const { taskState,action } = require('../constants/states');
const {NO_RUNNING_TASK_TO_PAUSE, NO_UPLOAD_TASK_FOUND, NO_RUNNING_TASK,
        NO_PAUSED_TASK, NO_EXPORT_TASK_FOUND} = require("../constants/messages");

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

const actionLabel = "Action"
const task = "Task";
const rowCount = "RowCount";


const taskPresent = async () => {
  if(await exists(actionLabel)) return true;
  return false;
}
const getRunningTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
      const status = Number(await get(task));
      if(status === taskState.RUNNING) {
       return await get(rowCount);
      }
  } 
  throw new Error(NO_RUNNING_TASK);
}

const endRunningTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
      const status = Number(await get(task));
      if(status === taskState.RUNNING) {
        await flushAll();
        return ;
      }
  }
    throw new Error(NO_RUNNING_TASK);
}

const endPausedTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
      await flushAll();
      return;
   }
  }
  throw new Error(NO_PAUSED_TASK);
}

const getPausedTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
      return await get(rowCount);
    }
  }
  throw new Error(NO_PAUSED_TASK);
}
const runPausedTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED) {
     await set(task,taskState.RUNNING);
      return;
   }
  }
  throw new Error(NO_PAUSED_TASK);
} 

const pauseRunningTask = async (actionType) => {
  const errMsg = actionType === action.UPLOAD ? NO_UPLOAD_TASK_FOUND : NO_EXPORT_TASK_FOUND;
  if(await get(actionLabel) !== actionType) throw new Error(errMsg);
  if(await exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.RUNNING) {
      await set(task, taskState.PAUSED);
      return;
    }
    throw new Error(NO_RUNNING_TASK_TO_PAUSE);
  }
}

const addTask = async (actionType) => {
      await setex(task, 3600, taskState.RUNNING);
      await setex(actionLabel, 3600, actionType);
      await setex(rowCount, 3600, 0);
}


const getSkipLinesCount = async () => {
  if(exists(task)) {
    const status = Number(await get(task));
    if(status === taskState.PAUSED)
    return await get(rowCount);
  }
  throw new Error(NO_PAUSED_TASK);
}

const incrementTaskRowCount = async () => {
  if(await exists(rowCount)) {
    const size = Number(await get(rowCount));
    await set(rowCount,size + 1);
    return;
  }
  throw new Error("No task to increment row");
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
  incrementTaskRowCount,
  taskPresent
}