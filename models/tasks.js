const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    status: Number,
    rowCount: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports.taskModel = mongoose.model('Task', taskSchema);