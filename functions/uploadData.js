const mongoose = require('mongoose');
const csv = require('csv-parser');

const uploadData = (db) => {
    const session = db.startSession();
    session.startTransaction();

}