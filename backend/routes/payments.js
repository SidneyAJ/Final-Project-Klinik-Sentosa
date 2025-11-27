const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');
const { calculatePaymentTotal } = require('../utils/paymentCalculator');
const { reduceStockOnPayment } = require('../utils/stockReducer');
const logAudit = require('../utils/auditLogger');

// Middleware to check admin role
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin only.' });
    }
}

// GET /api/payments/pending - Get pending payments (Admin)
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const query = `
            SELECT p.*, pat.full_name as patient_name, u.email as patient_email, 
                   pres.id as prescription_id
            FROM payments p
            JOIN patients pat ON p.patient_id = pat.id
            JOIN users u ON pat.user_id = u.id
            LEFT JOIN prescriptions pres ON p.prescription_id = pres.id
            WHERE p.status = 'pending'
            ORDER BY p.payment_date DESC
        `;
        const payments = await db.query(query);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching pending payments:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/payments/create-manual - Admin creates manual payment (Admin)
router.post('/create-manual', authenticateToken, requireAdmin, async (req, res) => {
    let { patient_id, user_id, prescription_id } = req.body;

    if (!patient_id && !user_id) {
        return res.status(400).json({ error: 'Patient ID or User ID is required' });
    }

    try {
        // 1. Get patient info
        let patient;
        if (patient_id) {
            [patient] = await db.query('SELECT * FROM patients WHERE id = ?', [patient_id]);
        } else if (user_id) {
            [patient] = await db.query('SELECT * FROM patients WHERE user_id = ?', [user_id]);
            if (patient) patient_id = patient.id;
        }

        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        // 2. Get prescription info (if any)
        let prescription = null;
        if (prescription_id) {
            [prescription] = await db.query('SELECT * FROM prescriptions WHERE id = ?', [prescription_id]);
        }

        // 3. Calculate total
        const calculation = calculatePaymentTotal(prescription, patient.patient_type);

        // 4. Create Payment Record (Verified immediately)
        const result = await db.query(
            `INSERT INTO payments (
                patient_id, prescription_id, amount, payment_date, 
                payment_method, status, verified_by, verified_at, notes
            ) VALUES (?, ?, ?, NOW(), 'admin_manual', 'verified', ?, NOW(), 'Pembayaran Manual via Admin')`,
            [patient_id, prescription_id || null, calculation.total, req.user.id]
        );

        const paymentId = result.insertId;

        // 5. Create Payment Items
        for (const item of calculation.items) {
            await db.query(
                `INSERT INTO payment_items (
                    payment_id, item_type, description, quantity, unit_price, total_price
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [paymentId, item.item_type, item.description, item.quantity, item.unit_price, item.total_price]
            );
        }

        // 6. Reduce Stock (if prescription exists)
        if (prescription_id) {
            await reduceStockOnPayment(req, prescription_id);
            // Update prescription status to 'paid' if needed, or just rely on payment status
            await db.query('UPDATE prescriptions SET status = "redeemed" WHERE id = ?', [prescription_id]);
        }

        // 7. Log Audit
        logAudit(req, 'PAYMENT_CREATED_MANUAL', {
            payment_id: paymentId,
            patient_id,
            amount: calculation.total,
            items: calculation.items
        });

        res.status(201).json({ message: 'Payment created and verified successfully', paymentId });

    } catch (error) {
        console.error('Error creating manual payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/payments/:id/verify - Verify payment (Admin)
router.put('/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
    const paymentId = req.params.id;

    try {
        // 1. Get payment info
        const [payment] = await db.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        console.log('[VERIFY] Payment found:', { id: payment.id, status: payment.status, prescription_id: payment.prescription_id });

        if (payment.status === 'verified') {
            return res.status(400).json({ error: 'Payment already verified' });
        }

        // 2. Update status
        await db.query(
            `UPDATE payments SET status = 'verified', verified_by = ?, verified_at = NOW() WHERE id = ?`,
            [req.user.id, paymentId]
        );
        console.log('[VERIFY] Payment status updated to verified');

        // 3. Reduce Stock (if prescription exists)
        if (payment.prescription_id) {
            console.log('[VERIFY] Reducing stock for prescription:', payment.prescription_id);
            await reduceStockOnPayment(req, payment.prescription_id);
            await db.query('UPDATE prescriptions SET status = "redeemed" WHERE id = ?', [payment.prescription_id]);
            console.log('[VERIFY] Prescription status updated to redeemed');
        } else {
            console.log('[VERIFY] No prescription_id, skipping stock reduction');
        }

        // 4. Log Audit
        logAudit(req, 'PAYMENT_VERIFIED', {
            payment_id: paymentId,
            verified_by: req.user.id
        });

        console.log('[VERIFY] ✅ Payment verification completed successfully');
        res.json({ message: 'Payment verified successfully' });

    } catch (error) {
        console.error('[VERIFY] ❌ Error verifying payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/payments/:id/reject - Reject payment (Admin)
router.put('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
    const paymentId = req.params.id;
    const { reason } = req.body;

    try {
        await db.query(
            `UPDATE payments SET status = 'rejected', notes = ? WHERE id = ?`,
            [reason, paymentId]
        );

        logAudit(req, 'PAYMENT_REJECTED', {
            payment_id: paymentId,
            reason
        });

        res.json({ message: 'Payment rejected' });
    } catch (error) {
        console.error('Error rejecting payment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
