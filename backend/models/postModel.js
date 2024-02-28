import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the User model
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    reports: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the User model
        },
        reason: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Post = mongoose.model('Post', postSchema);

export default Post;