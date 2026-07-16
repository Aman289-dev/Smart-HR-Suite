import Notification from '../models/Notification.js';

export const getNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ isRead: 1, createdAt: -1 });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId }, { isRead: true }, { new: true }
  );
  if (!notification) throw new Error('Notification not found');
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true };
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ userId, isRead: false });
};
