const express = require('express')
require('dotenv').config()
const app = express()

const PORT = (process.env.PORT || 2000);

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})