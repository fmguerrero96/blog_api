const express = require('express')
const createError = require('http-errors');
const cors = require('cors');
require('dotenv').config()
const app = express()

const postRoutes = require("./routes/postRoutes")
const userRoutes = require("./routes/userRoutes")
const commentRoutes = require("./routes/commentRoutes")

const PORT = (process.env.PORT || 2000);

app.use(express.json());
app.use(cors());

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
app.use('/blog', userRoutes);
app.use('/blog', commentRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})