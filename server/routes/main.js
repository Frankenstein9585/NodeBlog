const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const {locals} = require("express/lib/application");

router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        };

        const perPage = 10;
        let page = req.query.page || 1;

        const posts = await Post.aggregate([ { $sort: { createdAt: -1} } ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasnextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            posts,
            current: page,
            nextPage: hasnextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const locals = {
            title: post.title,
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }
        res.render('post', { post, locals, currentRoute: `/post/${req.params.id}` });
    } catch (error) {
        console.log(error);
    }
});


router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, "");
        const posts = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            ]
        });
        res.render('search', { posts, locals });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about' });
});

module.exports = router;