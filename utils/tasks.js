const { taskState } = require('../constants/states');
const { taskModel } = require('../models/tasks');

const getRunningTask = async () => {
  return await taskModel.findOne({status: taskState.RUNNING}).exec();
}

const endRunningTask = async () => {
  await taskModel.deleteOne({status: taskState.RUNNING}).exec();
}

const endPausedTask = async () => {
  await taskModel.findOneAndDelete({status: taskState.PAUSED}).exec();
}
const getPausedTask = async () => {
  return await taskModel.findOne({status: taskState.PAUSED}).exec();
}
const runPausedTask = async () => {
  await taskModel.findOneAndUpdate({status: taskState.PAUSED}, {$set:{status: taskState.RUNNING}}).exec();
}

const pauseRunningTask = async () => {
  await taskModel.findOneAndUpdate({status: taskState.RUNNING}, {$set: {status: taskState.PAUSED}}).exec();
}

const addTask = async () => {
  await taskModel.create({
          status: taskState.RUNNING,
          rowCount: 0
  })
}


const getSkipLinesCount = async () => {
  return await taskModel.findOne({status: taskState.PAUSED}, {rowCount:1, _id: 0}).exec();
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