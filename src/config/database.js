const mongoose = require('mongoose');

const ConnectDB = async()=>{
    await mongoose.connect(
        process.env.DB_CONNECTION_SECRET
    );
}; 

module.exports = ConnectDB;