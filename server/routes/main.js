const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

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
            nextPage: hasnextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;