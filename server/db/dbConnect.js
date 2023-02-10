const mongoose = require("mongoose");
require('dotenv').config();

// Function to house mongoose connection to mongoDB Atlas
async function dbConnect() {
    // Connect this app to database on mongoDB using the DB_URL (connection string)
    mongoose.connect(
        process.env.DB_URL,
        {
            // options to ensure that the connection is done properly
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }
    )
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.log("Unable to connecto to MongoDB Atlas");
        console.error(err);
    });
}

module.exports = dbConnect;