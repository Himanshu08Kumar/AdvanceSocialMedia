const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    username: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
})

const PostSchema = new mongoose.Schema({
    username: {type: String, require: true},
    location: {type: String},
    content: {type: String},
    image: {type: String, required: true},
    likes: {type: Number, default: 0},
    comments: [CommentSchema],
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.Schema('Post', PostSchema);