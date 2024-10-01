const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = './layouts/admin';


/**
 * Check Login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

/**
 * GET /
 * Admin - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }
        res.render('admin/login', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Login
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.cookie('token', token, { httpOnly: true });


        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});


/**
 * GET /
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }
        const posts = await Post.find();
        res.render('admin/dashboard', { locals, posts, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});


/**
 * GET /
 * Admin - Create new post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }
        const posts = await Post.find();
        res.render('admin/add-post', { locals, posts, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Admin - Create new post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }

        const { title, body } = req.body;
        const newPost = new Post({
            title,
            body,
        });

        await Post.create(newPost);
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Edit post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }

        const post = await Post.findById(req.params.id);

        res.render('admin/edit-post', { locals, post, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});


/**
 * PUT /
 * Admin - Edit post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }

        const { title, body } = req.body;
        await Post.findByIdAndUpdate(req.params.id, {
            title,
            body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});

/**
 * DELETE /
 * Admin - Delete post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Delete Post",
            description: "Simple Blog created with NodeJS, Express & MongoDB."
        }

        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin Logout
 */
router.get('/logout', authMiddleware, async (req, res) => {
   res.clearCookie('token');
   res.redirect('/');
});

/**
 * POST /
 * Register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json( { message: 'User registered successfully.', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already registered.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;