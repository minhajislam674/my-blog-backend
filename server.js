const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models");
const cors = require("cors");

require("dotenv").config();

//Database configuration
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

const app = express();

//Middlewares
app.use(
  cors({
    origin: "https://super-blog-app.netlify.app",
    credentials: true,
  })
);

app.use(express.json());

// app.use(express.static(path.join(__dirname, "../dist")));

// app.get(/^(?!\/api).+/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

//Routes
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
    const { uid } = req.user;
    const article = await Article.findOne({ title: req.params.articleName });
    if (article) {
      const upvoteIds = article.upvoteIds || [];
      article.canUpvote = uid && !upvoteIds.includes(uid);
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

//error handling middlware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
