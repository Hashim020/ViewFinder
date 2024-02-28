import cloudinary from "../../config/cloudinary.js";
import asyncHandler from 'express-async-handler';
import Post from "../../models/postModel.js";

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
        const userPosts = await Post.find({ userId: userId });
        
        res.status(200).json({ success: true, data: userPosts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

export {
    createPost,
    getUserPosts
};
