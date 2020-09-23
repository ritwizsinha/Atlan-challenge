const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
    object : Object,
    timestamp: {
        type: Date, 
        default: Date.now,
    },
});

module.exports.userModel = mongoose.model('User', userSchema);
