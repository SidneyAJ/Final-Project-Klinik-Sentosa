const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// GET /api/prescriptions/pending-verification - Get all prescriptions pending pharmacist verification
router.get('/pending-verification', authenticateToken, authorizeRole('pharmacist'), (req, res) => {
    const query = `
        SELECT 
            p.id,
            p.patient_id,
            p.doctor_id,
            p.appointment_id,
            p.medications,
            p.notes,
            p.status,
            p.verified_by,
            p.verified_at,
            p.rejection_reason,
            p.total_price,
            p.dispensed,
            p.dispensed_at,
            p.created_at,
            pu.name as patient_name,
            du.name as doctor_name,
            d.specialization,
            mr.diagnosis
        FROM prescriptions p
        JOIN patients pat ON p.patient_id = pat.id
        JOIN users pu ON pat.user_id = pu.id
        LEFT JOIN doctors d ON p.doctor_id = d.id
        LEFT JOIN users du ON d.user_id = du.id
        LEFT JOIN medical_records mr ON p.appointment_id = mr.appointment_id
        WHERE p.status = 'pending'
        ORDER BY p.created_at DESC
    `;

    db.all(query, [], (err, prescriptions) => {
        if (err) {
            console.error('Error fetching pending prescriptions:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Parse medications JSON for each prescription
        const result = prescriptions.map(p => ({
            ...p,
            medications: p.medications ? JSON.parse(p.medications) : []
        }));

        res.json(result);
    });
});


// PUT /api/prescriptions/:id/verify - Verify prescription (approve)
router.put('/:id/verify', authenticateToken, authorizeRole('pharmacist'), async (req, res) => {
    const { id } = req.params;

    try {
        // Get prescription with medications
        const prescription = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM prescriptions WHERE id = ? AND status = ?', [id, 'pending'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found or already processed' });
        }

        const medications = JSON.parse(prescription.medications || '[]');

        // Calculate total price and check stock
        let totalPrice = 0;
        const stockErrors = [];

        for (const med of medications) {
            const medicine = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM medicines WHERE name = ?', [med.name], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!medicine) {
                stockErrors.push(`Obat ${med.name} tidak ditemukan di database`);
                continue;
            }

            if (medicine.stock < (med.quantity || 1)) {
                stockErrors.push(`Stock ${med.name} tidak cukup (tersedia: ${medicine.stock})`);
                continue;
            }

            totalPrice += (medicine.price || 0) * (med.quantity || 1);
        }

        if (stockErrors.length > 0) {
            return res.status(400).json({ error: 'Stock tidak mencukupi', details: stockErrors });
        }

        // Update prescription status and price
        await new Promise((resolve, reject) => {
            const query = `
                UPDATE prescriptions
                SET status = 'verified',
                    verified_by = ?,
                    verified_at = NOW(),
                    total_price = ?,
                    rejection_reason = NULL
                WHERE id = ?
            `;
            db.run(query, [req.user.id, totalPrice, id], function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        // Reduce stock for each medication
        for (const med of medications) {
            const medicine = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM medicines WHERE name = ?', [med.name], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (medicine) {
                await new Promise((resolve, reject) => {
                    db.run(
                        'UPDATE medicines SET stock = stock - ? WHERE id = ?',
                        [med.quantity || 1, medicine.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            }
        }

        // Create notification for patient
        const patient = await new Promise((resolve, reject) => {
            db.get('SELECT user_id FROM patients WHERE id = ?', [prescription.patient_id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (patient) {
            await new Promise((resolve, reject) => {
                const notifQuery = `
                    INSERT INTO notifications (user_id, title, message, type, created_at)
                    VALUES (?, ?, ?, ?, NOW())
                `;
                db.run(notifQuery, [
                    patient.user_id,
                    'Resep Diverifikasi',
                    `Resep obat Anda telah diverifikasi apoteker. Total: Rp ${totalPrice.toLocaleString('id-ID')}`,
                    'success'
                ], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        res.json({
            message: 'Prescription verified successfully',
            totalPrice,
            stockReduced: true
        });

    } catch (error) {
        console.error('Error verifying prescription:', error);
        res.status(500).json({ error: 'Failed to verify prescription' });
    }
});

// PUT /api/prescriptions/:id/reject - Reject prescription
router.put('/:id/reject', authenticateToken, authorizeRole('pharmacist'), async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    console.log('[REJECT] Rejecting prescription:', { id, reason, user: req.user.id });

    if (!reason || !reason.trim()) {
        return res.status(400).json({ error: 'Rejection reason is required' });
    }

    try {
        const query = `
            UPDATE prescriptions
            SET status = 'rejected',
                verified_by = ?,
                verified_at = NOW(),
                rejection_reason = ?
            WHERE id = ? AND status = 'pending'
        `;

        const result = await new Promise((resolve, reject) => {
            db.run(query, [req.user.id, reason, id], function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        if (result.changes === 0) {
            console.log('[REJECT] ❌ Prescription not found or already processed');
            return res.status(404).json({ error: 'Prescription not found or already processed' });
        }

        console.log('[REJECT] ✅ Prescription rejected successfully');

        // Get patient info for notification
        const prescription = await new Promise((resolve, reject) => {
            db.get('SELECT patient_id FROM prescriptions WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (prescription) {
            const patient = await new Promise((resolve, reject) => {
                db.get('SELECT user_id FROM patients WHERE id = ?', [prescription.patient_id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (patient) {
                await new Promise((resolve, reject) => {
                    const notifQuery = `
                        INSERT INTO notifications (user_id, title, message, type, created_at)
                        VALUES (?, ?, ?, ?, NOW())
                    `;
                    db.run(notifQuery, [
                        patient.user_id,
                        'Resep Ditolak',
                        `Resep obat Anda ditolak. Alasan: ${reason}`,
                        'warning'
                    ], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
        }

        res.json({ message: 'Prescription rejected successfully' });

    } catch (error) {
        console.error('Error rejecting prescription:', error);
        res.status(500).json({ error: 'Failed to reject prescription' });
    }
});


module.exports = router;
