import mongoose from'mongoose';

const notificationSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['post', 'comment', 'follow'],
	},
	content: {
		type: String,
		required: true
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
