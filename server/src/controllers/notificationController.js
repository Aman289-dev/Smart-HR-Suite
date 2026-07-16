import * as notificationService from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    const unreadCount = await notificationService.getUnreadCount(req.user._id);
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
