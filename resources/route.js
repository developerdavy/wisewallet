
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const budgetController = require('../controllers/budgetController');
const transactionController = require('../controllers/transactionController');
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Authentication routes
router.post('/auth/login', authController.loginUser);
router.post('/auth/logout', authController.logoutUser);
router.get('/auth/verify', authController.verifyToken);

// User routes
router.get('/users', authenticateToken, userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, userController.updateUser);

// Account routes
router.get('/users/:userId/accounts', authenticateToken, accountController.getUserAccounts);
router.post('/accounts', authenticateToken, accountController.createAccount);
router.get('/accounts/:id', authenticateToken, accountController.getAccountById);
router.put('/accounts/:id/balance', authenticateToken, accountController.updateAccountBalance);

// Budget routes
router.get('/users/:userId/budgets', authenticateToken, budgetController.getUserBudgets);
router.post('/budgets', authenticateToken, budgetController.createBudget);
router.get('/budgets/:id', authenticateToken, budgetController.getBudgetById);
router.put('/budgets/:id', authenticateToken, budgetController.updateBudget);
router.delete('/budgets/:id', authenticateToken, budgetController.deleteBudget);

// Transaction routes
router.get('/users/:userId/transactions', authenticateToken, transactionController.getUserTransactions);
router.get('/accounts/:accountId/transactions', authenticateToken, transactionController.getAccountTransactions);
router.post('/transactions', authenticateToken, transactionController.createTransaction);
router.get('/transactions/:id', authenticateToken, transactionController.getTransactionById);
router.put('/transactions/:id', authenticateToken, transactionController.updateTransaction);
router.delete('/transactions/:id', authenticateToken, transactionController.deleteTransaction);

// Notification routes
router.get('/users/:userId/notifications', authenticateToken, notificationController.getUserNotifications);
router.post('/notifications', authenticateToken, notificationController.createNotification);
router.put('/notifications/:id/read', authenticateToken, notificationController.markAsRead);
router.put('/users/:userId/notifications/read', authenticateToken, notificationController.markAllAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;
