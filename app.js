const express = require('express')
const createError = require('http-errors');
require('dotenv').config()
const app = express()

const postRoutes = require("./routes/postRoutes")

const PORT = (process.env.PORT || 2000);

app.use(express.json());

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

//blog routes
app.use('/blog', postRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})