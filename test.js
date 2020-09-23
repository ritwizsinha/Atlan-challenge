// const mongoose =require('mongoose');
// const fs = require('fs');
// const csv = require('csv-parser');

// const { taskModel } = require('./models/tasks');
// const { userModel } = require('./models/users');
// const { uploadState } = require('./constants/states');
// const { MONGO_URI } = require('./constants/urls');

// mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('open', () => {
//     console.log("Connected successfully")
// });
// const newTask =  new taskModel({
//     status: "Running",
//     threadId: process.pid,
//     rowCount: 0,
// });
// newTask.save((err, doc) => {
//     if(err) console.log("Some error happened", err);
//     else console.log("inserted succesfully");
// })

(async() => {
    for await (let i=0;i<10;i++)
})()