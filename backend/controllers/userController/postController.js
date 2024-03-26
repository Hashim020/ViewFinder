import cloudinary from "../../config/cloudinary.js";
import asyncHandler from 'express-async-handler';
import Post from "../../models/postModel.js";
import Comment from '../../models/commentsModal.js'
import { response } from "express";

const createPost = asyncHandler(async (req, res) => {
    const { caption, image } = req.body;

    const userId = req.user._id;

    const result = await cloudinary.uploader.upload(image, {
        folder: "Posts",
    });
    const newPost = await Post.create({
        userId,
        caption,
        image: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });

});

const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const userPosts = await Post.find({ userId: userId, isListed: true }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: userPosts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

const getAllUsersPost = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const allPosts = await Post.find({ isListed: true }).sort({ createdAt: -1 }).populate('userId');
        res.status(200).json({ success: true, data: allPosts, userId: userId });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


const likeUnlikePost = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json({ success: true, liked: !isLiked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


const postComment = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { content, POSTID } = req.body

        const newComment = new Comment({
            userId: userId,
            content: content
        });

        const savedComment = await newComment.save();


        const post = await Post.findById(POSTID);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push(savedComment._id);

        await post.save();

        res.status(201).json({ success: "true", message: 'Comment added successfully', comment: savedComment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
const getPostComments = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log(postId);


        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'userId',
                model: 'User'
            }
        });

        const comments = post.comments;
        console.log(comments);

        res.status(200).json({ comments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { caption } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Access denied. You are not authorized to edit this post.' });
        }

        if (caption) {
            post.caption = caption;
        }

        post.isEdited = true;

        await post.save();

        return res.status(200).json({ message: 'Post caption updated successfully', success: "true", });
    } catch (error) {
        console.error('Error editing post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const getPostForMadal = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId).populate('userId');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Error fetching post:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

const getLikedUsers = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate({
        path: 'likes',
        select: 'username name profileImageName url _id'
    });

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const likedUsers = post.likes.map(user => ({
        id: user._id,
        username: user.username,
        name: user.name,
        photo: user.profileImageName ? user.profileImageName.url : null
    }));

    res.status(200).json(likedUsers);
});


export {
    createPost,
    getUserPosts,
    getAllUsersPost,
    likeUnlikePost,
    postComment,
    getPostComments,
    editPost,
    getPostForMadal,
    getLikedUsers
};
