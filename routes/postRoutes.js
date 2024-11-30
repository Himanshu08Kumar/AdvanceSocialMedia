const express = require('express')
const multer = require('multer')
const Post = require('../models/Post')
const authenticate = require('../middleware/authMiddleware');
const { route } = require('./authRoutes');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})

const upload = multer({ storage });

//-------- Create a post --------

router.post('/', authenticate, upload.single('image'), async (req, res) =>{
    try {
        const { location, content } = req.body;
        const { username } = req.user;
        const image = req.file.path;

        const post = new Post({ username, location, image, content});
        await post.save();

        res.status(201).json({message: 'Post Created Successfully', post});
    } catch (error) {
        res.status(500).json({error: 'Error creating post', details: error.message})
    }
})

//-------- Like a post --------
router.post('/:id/like', authenticate, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error: 'Post not found'});

        post.likes += 1;
        await post.save();

        res.status(200).json({message: 'Post Liked', likes: post.likes})
    } catch (error) {
        res.status(500).json({error:'Error liking post', details: error.message})
    }
})

//-------- Comment on a post --------

router.post('/:id/comment', authenticate, async (req, res) =>{
    try {
        const { text } = req.body;
        const { username } = req.user;
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json({error: 'Post not found'});

        post.comments.push({username, text})
        await post.save();

        res.status(201).json({ message:'Comment added successfully', comments: post.comments})
    } catch (error) {
        res.status(500).json({error:'Error adding comment', details: error.message})
    }
})


module.exports = router;