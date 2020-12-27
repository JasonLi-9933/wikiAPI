// jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ArticleModel = require("./schema/ArticleSchema");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});

const localURL = "mongodb://localhost:27017/wikiDB";
mongoose.connect(localURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.route('/articles')
    .get((req, res) => {
        ArticleModel.find({}, (err, articles) => {
            if (err) {
                console.log("Error finding articles!!!");
                res.send(err);
            } else {
                res.send(articles);
            }
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new ArticleModel({
            title: title,
            content: content
        });
        newArticle.save((err) => {
            if (!err) res.send("Successfully added a new article!!!");
            else res.send(err);
        });
    })
    .delete((req, res) => {
        ArticleModel.deleteMany({}, (err) => {
            if (!err) res.send("Successfully deleted all articles!!!");
            else res.send(err);
        });
    });

app.route('/articles/:targetArticle')
    .get((req, res) => {
        const targetArticleTitle = req.params.targetArticle;
        ArticleModel.findOne({
            title: targetArticleTitle
        }, (err, article) => {
            if (article) res.send(article);
            else {
                res.send("No such article!!!");
            }
        });
    })
    .put((req, res) => {
        const targetArticleTitle = req.params.targetArticle;
        ArticleModel.update({
            title: targetArticleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, (err) => {
            if (!err) res.send("Article updated successfully!")
        });
    })
    .patch((req, res) => {
        const targetArticleTitle = req.params.targetArticle;
        ArticleModel.update({
            title: targetArticleTitle
        }, {
            $set: req.body
        }, {
            overwrite: false
        }, (err) => {
            if (!err) res.send("Article patched successfully!");
            else res.send(err);
        });
    })
    .delete((req, res) => {
        const targetArticleTitle = req.params.targetArticle;
        ArticleModel.deleteOne({
            title: targetArticleTitle
        }, (err) => {
            if (!err) res.send("Article deleted successfully!!!");
            else res.send(err); 
        });
    });