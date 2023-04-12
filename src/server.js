const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models");
const cors = require("cors");

require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@${process.env.DB_NAME}.dik4jhy.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(MONGODB_URI, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

//Insert data to database
// const article = new Article({
//   title: "Learn React",
//   author: "Tak M",
//   content: "some content",
//   vote: 11,
//   comments: [],
// });

// article.save();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET all articles

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    if (articles) {
      res.status(200).json(articles);
    } else {
      res.status(404).json({ message: "No articles found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// GET a specific article

app.get("/articles/:articleName", async (req, res) => {
  try {
    const article = await Article.findOne({ title: req.params.articleName });
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// UPDATE - Add vote to article

app.put("/articles/:articleId/addvote", async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleId });
    if (article) {
      article.vote = article.vote + 1;
      article.save();
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// UPDATE - Remove vote to article

app.put("/articles/:articleId/removevote", async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleId });
    if (article) {
      article.vote = article.vote - 1;
      article.save();
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// POST - Add comment to article

app.post("/articles/:articleId/comments", async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleId });
    if (article) {
      article.comments.push(req.body);
      article.save();
      res.status(201).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// DELETE - Delete comment from article

app.delete("/articles/:articleId/comments/:commentId", async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleId });
    if (article) {
      article.comments = article.comments.filter(
        (comment) => comment._id != req.params.commentId
      );
      article.save();
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
