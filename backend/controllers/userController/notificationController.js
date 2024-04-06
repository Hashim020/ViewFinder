import Notification from "../../models/notificationsModel.js";


const createNotification = async(recipientId, senderId, notificationType, entityType, entityID, Postimage)=> {
    try {
        const notification = new Notification({
            recipientId,
            senderId,
            notificationType,
            entityType,
            entityID,
            Postimage
        });

        await notification.save();
        console.log('Notification created successfully.');
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

export{
    createNotification
}