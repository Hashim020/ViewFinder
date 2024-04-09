import Notification from '../../models/notificationsModel.js';

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ receiver: userId })
            .populate('sender', 'username profileImageName')
            .populate('postId')
            .sort({ timestamp: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error fetching notifications' });
    }
};

export { getNotification };
