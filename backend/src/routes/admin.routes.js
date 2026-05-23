const express = require('express');
const router = express.Router();
const { getPendingPartners, approveFoodPartner, rejectFoodPartner, getAllPartners, deleteFoodPartner } = require('../controllers/auth.controller');

// Admin authentication middleware - simple hardcoded password
const adminAuth = (req, res, next) => {
    const adminPassword = req.headers['x-admin-password'];
    
    if (!adminPassword) {
        return res.status(401).json({
            message: 'Admin password required'
        });
    }

    // Use environment variable or hardcoded admin password
    const correctPassword = process.env.ADMIN_PASSWORD;
    
    if (adminPassword !== correctPassword) {
        return res.status(403).json({
            message: 'Invalid admin password'
        });
    }

    next();
};

// Get all pending food partners
router.get('/pending-partners', adminAuth, getPendingPartners);

// Get all registered food partners
router.get('/all-partners', adminAuth, getAllPartners);

// Approve a food partner
router.post('/approve-partner/:partnerId', adminAuth, approveFoodPartner);

// Reject a food partner (pending registration)
router.delete('/reject-partner/:partnerId', adminAuth, rejectFoodPartner);

// Delete a food partner (any status)
router.delete('/delete-partner/:partnerId', adminAuth, deleteFoodPartner);

module.exports = router;
