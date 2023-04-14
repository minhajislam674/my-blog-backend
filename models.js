const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const article = new Schema({
  title: String,
  author: String,
  content: String,
  vote: Number,
  comments: [
    {
      user: String,
      content: String,
    },
  ],
});

const Article = model("Article", article);

module.exports = Article;
