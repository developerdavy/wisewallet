
const db = require('../resources/connection')

// Get all budgets for a user
const getUserBudgets = async(req, res) => {
    const { userId } = req.params
    
    try {
        const [budgets] = await db.query('SELECT * FROM budgets WHERE USER_ID = ?', [userId])
        
        if(budgets.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'No budgets found for this user'
            })
        }
        
        res.status(200).json({
            status: 'success',
            budgets: budgets
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Create new budget
const createBudget = async(req, res) => {
    const { user_id, category, amount, period, start_date, end_date } = req.body
    
    try {
        if(!user_id || !category || !amount || !period) {
            return res.status(400).json({
                status: 'failed',
                message: 'User ID, category, amount, and period are required'
            })
        }
        
        const created_at = new Date()
        const updated_at = new Date()
        
        const [result] = await db.query(
            'INSERT INTO budgets (USER_ID, CATEGORY, AMOUNT, PERIOD, START_DATE, END_DATE, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, category, amount, period, start_date, end_date, created_at, updated_at]
        )
        
        res.status(201).json({
            status: 'success',
            message: 'Budget created successfully',
            budget: {
                id: result.insertId,
                user_id,
                category,
                amount,
                period,
                start_date,
                end_date
            }
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create budget'
        })
    }
}

// Get budget by ID
const getBudgetById = async(req, res) => {
    const { id } = req.params
    
    try {
        const [budget] = await db.query('SELECT * FROM budgets WHERE BUDGET_ID = ?', [id])
        
        if(budget.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Budget not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            budget: budget[0]
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Update budget
const updateBudget = async(req, res) => {
    const { id } = req.params
    const { category, amount, period, start_date, end_date } = req.body
    
    try {
        const updated_at = new Date()
        
        const [result] = await db.query(
            'UPDATE budgets SET CATEGORY = ?, AMOUNT = ?, PERIOD = ?, START_DATE = ?, END_DATE = ?, UPDATED_AT = ? WHERE BUDGET_ID = ?',
            [category, amount, period, start_date, end_date, updated_at, id]
        )
        
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Budget not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Budget updated successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update budget'
        })
    }
}

// Delete budget
const deleteBudget = async(req, res) => {
    const { id } = req.params
    
    try {
        const [result] = await db.query('DELETE FROM budgets WHERE BUDGET_ID = ?', [id])
        
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Budget not found'
            })
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Budget deleted successfully'
        })
        
    } catch(error) {
        console.error('Database error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete budget'
        })
    }
}

module.exports = {
    getUserBudgets,
    createBudget,
    getBudgetById,
    updateBudget,
    deleteBudget
}
