const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    text: {type: String, required: true},
    time_stamp: { type: Date, default: Date.now },
    public: {type: Boolean, required: true, default: true}
})

module.exports = mongoose.model("Post", PostSchema);