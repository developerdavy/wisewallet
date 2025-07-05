
const db = require('../resources/connection')

// Get all notifications for a user
const getUserNotifications = async(req, res) => {
    const { userId } = req.params
    
    try {
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE USER_ID = ? ORDER BY CREATED_AT DESC',
            [userId]
        )
        
        if(notifications.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'No notifications found for this user'
            })
        }
        
        res.status(200).json({
            status: 'success',
            notifications: notifications
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Create new notification
const createNotification = async(req, res) => {
    const { user_id, title, message, type, is_read } = req.body
    
    try {
        if(!user_id || !title || !message) {
            return res.status(400).json({
                status: 'failed',
                message: 'User ID, title, and message are required'
            })
        }
        
        const created_at = new Date()
        const updated_at = new Date()
        
        const [result] = await db.query(
            'INSERT INTO notifications (USER_ID, TITLE, MESSAGE, TYPE, IS_READ, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, title, message, type || 'info', is_read || false, created_at, updated_at]
        )
        
        res.status(201).json({
            status: 'success',
            message: 'Notification created successfully',
            notification: {
                id: result.insertId,
                user_id,
                title,
                message,
                type: type || 'info',
                is_read: is_read || false
            }
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create notification'
        })
    }
}

// Mark notification as read
const markAsRead = async(req, res) => {
    const { id } = req.params
    
    try {
        const updated_at = new Date()
        
        const [result] = await db.query(
            'UPDATE notifications SET IS_READ = true, UPDATED_AT = ? WHERE NOTIFICATION_ID = ?',
            [updated_at, id]
        )
        
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Notification not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update notification'
        })
    }
}

// Mark all notifications as read for a user
const markAllAsRead = async(req, res) => {
    const { userId } = req.params
    
    try {
        const updated_at = new Date()
        
        await db.query(
            'UPDATE notifications SET IS_READ = true, UPDATED_AT = ? WHERE USER_ID = ?',
            [updated_at, userId]
        )
        
        res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update notifications'
        })
    }
}

// Delete notification
const deleteNotification = async(req, res) => {
    const { id } = req.params
    
    try {
        const [result] = await db.query('DELETE FROM notifications WHERE NOTIFICATION_ID = ?', [id])
        
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Notification not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete notification'
        })
    }
}

module.exports = {
    getUserNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
}
