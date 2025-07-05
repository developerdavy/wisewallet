
const db = require('../resources/connection')

// Get all accounts for a user
const getUserAccounts = async(req, res) => {
    const { userId } = req.params
    
    try {
        const [accounts] = await db.query('SELECT * FROM accounts WHERE USER_ID = ?', [userId])
        
        if(accounts.length === 0){
            return res.status(404).json({
                status: 'failed',
                message: 'No accounts found for this user'
            })
        }
        
        res.status(200).json({
            status: 'success',
            accounts: accounts
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Create new account
const createAccount = async(req, res) => {
    const { user_id, account_name, account_type, balance } = req.body
    
    try {
        if(!user_id || !account_name || !account_type) {
            return res.status(400).json({
                status: 'failed',
                message: 'User ID, account name, and account type are required'
            })
        }
        
        const created_at = new Date()
        const updated_at = new Date()
        
        const [result] = await db.query(
            'INSERT INTO accounts (USER_ID, ACCOUNT_NAME, ACCOUNT_TYPE, BALANCE, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, account_name, account_type, balance || 0, created_at, updated_at]
        )
        
        res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            account: {
                id: result.insertId,
                user_id,
                account_name,
                account_type,
                balance: balance || 0
            }
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create account'
        })
    }
}

// Get account by ID
const getAccountById = async(req, res) => {
    const { id } = req.params
    
    try {
        const [account] = await db.query('SELECT * FROM accounts WHERE ACCOUNT_ID = ?', [id])
        
        if(account.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            account: account[0]
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Update account balance
const updateAccountBalance = async(req, res) => {
    const { id } = req.params
    const { balance } = req.body
    
    try {
        if(balance === undefined) {
            return res.status(400).json({
                status: 'failed',
                message: 'Balance is required'
            })
        }
        
        const updated_at = new Date()
        
        const [result] = await db.query(
            'UPDATE accounts SET BALANCE = ?, UPDATED_AT = ? WHERE ACCOUNT_ID = ?',
            [balance, updated_at, id]
        )
        
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Account balance updated successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update account'
        })
    }
}

module.exports = {
    getUserAccounts,
    createAccount,
    getAccountById,
    updateAccountBalance
}
