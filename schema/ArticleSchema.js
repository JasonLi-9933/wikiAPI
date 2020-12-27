//jshint esversion:6

const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String,  required: true}
});

module.exports = mongoose.model("article", ArticleSchema);