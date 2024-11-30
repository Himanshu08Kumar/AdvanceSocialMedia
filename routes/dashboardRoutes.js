const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticate, async (req, res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) return res.status(400).json({ error: "User not found!!" });

        res.status(200).json({username: user.username, email: user.email, profileImage: user.profileImage});
    } catch (error) {
        res.status(500).json({error: 'Error fetching user Profile', details: error.message})
    }
})

module.exports = router;