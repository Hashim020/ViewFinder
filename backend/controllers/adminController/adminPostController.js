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

const getPostReports = async (req, res) => {
    try {
        console.log("lajsdfasdfasdflasdfjasdljflasdjf");
        const postId = req.params.postid;
        console.log(postId);
        const post = await Post.findById(postId).populate('reports.userId');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reports = post.reports;

        res.status(200).json({ reports });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const getPostDataOverview = async (req, res) => {
    try {
        const postsByMonth = await Post.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' }, 
                    count: { $sum: 1 }, 
                },
            },
        ]);

        res.json(postsByMonth);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


export {
    getPostWithPaginations,
    postListUnlist,
    getPostReports,
    getPostDataOverview
}