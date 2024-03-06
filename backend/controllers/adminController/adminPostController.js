import User from '../../models/userModel.js';
import Post from '../../models/postModel.js';

const getPostWithPaginations = async (req, res) => {
    try {
        const { page, perPage } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(perPage);
        const posts = await Post.find().skip(skip).limit(parseInt(perPage));
        const totalCount = await Post.countDocuments();
        const totalPages = Math.ceil(totalCount / parseInt(perPage));
        res.json({ posts, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const postListUnlist = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        console.log(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.isListed = !post.isListed;
        await post.save();

        const actionMessage = post.isListed ? 'listed' : 'unlisted';
        res.json({ message: `Post ${actionMessage} successfully`, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export{
    getPostWithPaginations,
    postListUnlist
}