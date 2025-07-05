
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountController = require('../controllers/accountController');
const budgetController = require('../controllers/budgetController');
const transactionController = require('../controllers/transactionController');
const notificationController = require('../controllers/notificationController');

// User routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);

// Account routes
router.get('/users/:userId/accounts', accountController.getUserAccounts);
router.post('/accounts', accountController.createAccount);
router.get('/accounts/:id', accountController.getAccountById);
router.put('/accounts/:id/balance', accountController.updateAccountBalance);

// Budget routes
router.get('/users/:userId/budgets', budgetController.getUserBudgets);
router.post('/budgets', budgetController.createBudget);
router.get('/budgets/:id', budgetController.getBudgetById);
router.put('/budgets/:id', budgetController.updateBudget);
router.delete('/budgets/:id', budgetController.deleteBudget);

// Transaction routes
router.get('/users/:userId/transactions', transactionController.getUserTransactions);
router.get('/accounts/:accountId/transactions', transactionController.getAccountTransactions);
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions/:id', transactionController.getTransactionById);
router.put('/transactions/:id', transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

// Notification routes
router.get('/users/:userId/notifications', notificationController.getUserNotifications);
router.post('/notifications', notificationController.createNotification);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/users/:userId/notifications/read', notificationController.markAllAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;
