const { taskState } = require('../constants/states');
const { taskModel } = require('../models/tasks');

const getRunningTask = async () => {
  return await taskModel.findOne({status: taskState.RUNNING}).exec();
}

const endRunningTask = async () => {
  const runningTask = await getRunningTask();
  console.log(runningTask);
  if(runningTask) {
    await taskModel.deleteOne({status: taskState.RUNNING}).exec();
    return;
  }
  throw new Error("No running task exists");
}

const endPausedTask = async () => {
  const pausedTask = await getPausedTask();
  if(pausedTask) {
    await taskModel.findOneAndDelete({status: taskState.PAUSED}).exec();
    return;
  }
  throw new Error("No Paused Task found");
}
const getPausedTask = async () => {
  return await taskModel.findOne({status: taskState.PAUSED}).exec();
}
const runPausedTask = async () => {
  const pausedTask = await getPausedTask();
  if(pausedTask) {
    await taskModel.findOneAndUpdate({status: taskState.PAUSED}, {$set:{status: taskState.RUNNING}}).exec();
    return;
  }
  throw new Error("No Paused Task found");
}

const pauseRunningTask = async () => {
  const runningTask = await getRunningTask();
  if(runningTask) {
    await taskModel.findOneAndUpdate({status: taskState.RUNNING}, {$set: {status: taskState.PAUSED}}).exec();
    return;
  }
  throw new Error("No running task exists");
}

const addTask = async () => {
  await taskModel.create({
          status: taskState.RUNNING,
          rowCount: 0
  })
}


const getSkipLinesCount = async () => {
  const pausedTask = await getPausedTask();
  if(pausedTask)
    return await taskModel.findOne({status: taskState.PAUSED}, {rowCount:1, _id: 0}).exec();
  throw new Error("No Paused Task found");

}

const incrementTaskRowCount = async (runningTask) => {
  return await taskModel.updateOne({_id: runningTask._id},{$set: {rowCount: (runningTask.rowCount +1)}}).exec();
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