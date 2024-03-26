import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
	recipientId: {
		type: String
	},
	senderId: {
		type: String,
		required: true
	},
	notificationType: {
		type: String,
		enum: ["like", "comment", "follow", "message", "admin", "request"],
		required: true
	},
	entityType: {
		type: String
	},
	entityID: {
		type: String
	},
	Postimage: { type: String },
	isRead: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };