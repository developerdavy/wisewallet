
const db = require('../resources/connection')

// Get all transactions for a user
const getUserTransactions = async(req, res) => {
    const { userId } = req.params
    
    try {
        const [transactions] = await db.query(
            'SELECT t.*, a.ACCOUNT_NAME FROM transactions t JOIN accounts a ON t.ACCOUNT_ID = a.ACCOUNT_ID WHERE a.USER_ID = ? ORDER BY t.TRANSACTION_DATE DESC',
            [userId]
        )
        
        if(transactions.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'No transactions found for this user'
            })
        }
        
        res.status(200).json({
            status: 'success',
            transactions: transactions
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Get transactions for a specific account
const getAccountTransactions = async(req, res) => {
    const { accountId } = req.params
    
    try {
        const [transactions] = await db.query(
            'SELECT * FROM transactions WHERE ACCOUNT_ID = ? ORDER BY TRANSACTION_DATE DESC',
            [accountId]
        )
        
        if(transactions.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'No transactions found for this account'
            })
        }
        
        res.status(200).json({
            status: 'success',
            transactions: transactions
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Create new transaction
const createTransaction = async(req, res) => {
    const { account_id, amount, transaction_type, category, description, transaction_date } = req.body
    
    try {
        if(!account_id || !amount || !transaction_type) {
            return res.status(400).json({
                status: 'failed',
                message: 'Account ID, amount, and transaction type are required'
            })
        }
        
        const created_at = new Date()
        const updated_at = new Date()
        const transactionDate = transaction_date || new Date()
        
        const [result] = await db.query(
            'INSERT INTO transactions (ACCOUNT_ID, AMOUNT, TRANSACTION_TYPE, CATEGORY, DESCRIPTION, TRANSACTION_DATE, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [account_id, amount, transaction_type, category, description, transactionDate, created_at, updated_at]
        )
        
        // Update account balance
        const balanceChange = transaction_type.toLowerCase() === 'credit' ? amount : -amount
        await db.query(
            'UPDATE accounts SET BALANCE = BALANCE + ?, UPDATED_AT = ? WHERE ACCOUNT_ID = ?',
            [balanceChange, updated_at, account_id]
        )
        
        res.status(201).json({
            status: 'success',
            message: 'Transaction created successfully',
            transaction: {
                id: result.insertId,
                account_id,
                amount,
                transaction_type,
                category,
                description,
                transaction_date: transactionDate
            }
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create transaction'
        })
    }
}

// Get transaction by ID
const getTransactionById = async(req, res) => {
    const { id } = req.params
    
    try {
        const [transaction] = await db.query('SELECT * FROM transactions WHERE TRANSACTION_ID = ?', [id])
        
        if(transaction.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            transaction: transaction[0]
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Update transaction
const updateTransaction = async(req, res) => {
    const { id } = req.params
    const { amount, transaction_type, category, description, transaction_date } = req.body
    
    try {
        // Get original transaction to calculate balance difference
        const [originalTransaction] = await db.query('SELECT * FROM transactions WHERE TRANSACTION_ID = ?', [id])
        
        if(originalTransaction.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found'
            })
        }
        
        const updated_at = new Date()
        
        const [result] = await db.query(
            'UPDATE transactions SET AMOUNT = ?, TRANSACTION_TYPE = ?, CATEGORY = ?, DESCRIPTION = ?, TRANSACTION_DATE = ?, UPDATED_AT = ? WHERE TRANSACTION_ID = ?',
            [amount, transaction_type, category, description, transaction_date, updated_at, id]
        )
        
        // Calculate balance adjustment
        const original = originalTransaction[0]
        const originalBalance = original.TRANSACTION_TYPE.toLowerCase() === 'credit' ? original.AMOUNT : -original.AMOUNT
        const newBalance = transaction_type.toLowerCase() === 'credit' ? amount : -amount
        const balanceDifference = newBalance - originalBalance
        
        // Update account balance
        await db.query(
            'UPDATE accounts SET BALANCE = BALANCE + ?, UPDATED_AT = ? WHERE ACCOUNT_ID = ?',
            [balanceDifference, updated_at, original.ACCOUNT_ID]
        )
        
        res.status(200).json({
            status: 'success',
            message: 'Transaction updated successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update transaction'
        })
    }
}

// Delete transaction
const deleteTransaction = async(req, res) => {
    const { id } = req.params
    
    try {
        // Get transaction to reverse balance change
        const [transaction] = await db.query('SELECT * FROM transactions WHERE TRANSACTION_ID = ?', [id])
        
        if(transaction.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found'
            })
        }
        
        const [result] = await db.query('DELETE FROM transactions WHERE TRANSACTION_ID = ?', [id])
        
        // Reverse balance change
        const balanceChange = transaction[0].TRANSACTION_TYPE.toLowerCase() === 'credit' ? -transaction[0].AMOUNT : transaction[0].AMOUNT
        const updated_at = new Date()
        
        await db.query(
            'UPDATE accounts SET BALANCE = BALANCE + ?, UPDATED_AT = ? WHERE ACCOUNT_ID = ?',
            [balanceChange, updated_at, transaction[0].ACCOUNT_ID]
        )
        
        res.status(200).json({
            status: 'success',
            message: 'Transaction deleted successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete transaction'
        })
    }
}

module.exports = {
    getUserTransactions,
    getAccountTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
}
