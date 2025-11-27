const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const logAudit = require('../utils/auditLogger');

// Middleware - all routes require nurse authentication
router.use(authenticateToken);
router.use(authorizeRole('nurse'));

// Helper function to get nurse ID from user ID (creates profile if not exists)
async function getNurseId(userId) {
    try {
        const [nurse] = await db.query('SELECT id FROM nurses WHERE user_id = ?', [userId]);
        if (nurse) return nurse.id;

        // If nurse profile not found, create it
        console.log(`[getNurseId] Nurse profile not found for user_id ${userId}, creating one...`);

        // Get user details first
        const [user] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        if (!user) throw new Error('User not found');

        const result = await db.query(
            'INSERT INTO nurses (user_id, full_name) VALUES (?, ?)',
            [userId, user.name]
        );

        console.log(`[getNurseId] Created nurse profile with id ${result.insertId}`);
        return result.insertId;
    } catch (err) {
        console.error('Error getting/creating nurse ID:', err);
        throw err;
    }
}

// GET /api/nurses/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
    try {
        const now = new Date();
        const today = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');

        // Get waiting queue count (nurse_status='pending')
        const [waitingQueueResult] = await db.query(`
            SELECT COUNT(*) as count 
            FROM queues 
            WHERE DATE(created_at) = ? AND nurse_status = 'pending'
        `, [today]);
        const waitingQueue = waitingQueueResult.count || 0;

        // Get completed today count
        const [completedResult] = await db.query(`
            SELECT COUNT(*) as count 
            FROM vital_signs 
            WHERE DATE(recorded_at) = ?
        `, [today]);
        const completedToday = completedResult.count || 0;

        // Get total registered patients
        const [totalPatientsResult] = await db.query(`
            SELECT COUNT(*) as count FROM patients
        `);
        const totalPatients = totalPatientsResult.count || 0;

        res.json({
            waitingQueue,
            completedToday,
            totalPatients
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// GET /api/nurses/queue/pending - Get patients waiting for vital signs check
router.get('/queue/pending', async (req, res) => {
    try {
        const now = new Date();
        const today = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');

        const queues = await db.query(`
            SELECT 
                q.id as queue_id,
                q.queue_number,
                q.nurse_status,
                a.id as appointment_id,
                a.appointment_time,
                a.notes,
                pat.id as patient_id,
                pat.full_name as patient_name,
                pat.date_of_birth,
                pat.gender,
                pat.phone
            FROM queues q
            JOIN appointments a ON q.appointment_id = a.id
            JOIN patients pat ON a.patient_id = pat.id
            WHERE DATE(a.appointment_date) = ? 
            AND q.nurse_status = 'pending'
            ORDER BY q.queue_number ASC
        `, [today]);

        res.json(queues);

    } catch (error) {
        console.error('Get pending queue error:', error);
        res.status(500).json({ error: 'Failed to fetch pending queue' });
    }
});

// POST /api/nurses/vital-signs - Record vital signs
router.post('/vital-signs', async (req, res) => {
    console.log('[VITAL SIGNS] ===== REQUEST RECEIVED =====');
    console.log('[VITAL SIGNS] User:', req.user);
    console.log('[VITAL SIGNS] Body:', JSON.stringify(req.body, null, 2));

    try {
        const nurseId = await getNurseId(req.user.id);
        console.log('[VITAL SIGNS] Nurse ID found:', nurseId);

        const {
            patient_id,
            queue_id,
            appointment_id,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            heart_rate,
            temperature,
            weight,
            height,
            blood_type,
            oxygen_saturation,
            notes
        } = req.body;

        console.log('[VITAL SIGNS] Data to save:', { patient_id, queue_id, appointment_id, nurse_id: nurseId });

        if (!patient_id || !queue_id) {
            console.log('[VITAL SIGNS] Missing required fields');
            return res.status(400).json({ error: 'Patient ID and Queue ID are required' });
        }

        // Create vital signs record
        console.log('[VITAL SIGNS] Inserting into database...');
        const result = await db.query(`
            INSERT INTO vital_signs (
                patient_id, appointment_id, queue_id, nurse_id,
                blood_pressure_systolic, blood_pressure_diastolic,
                heart_rate, temperature, weight, height,
                blood_type, oxygen_saturation, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            patient_id, appointment_id, queue_id, nurseId,
            blood_pressure_systolic, blood_pressure_diastolic,
            heart_rate, temperature, weight, height,
            blood_type, oxygen_saturation, notes
        ]);

        const vitalSignsId = result.insertId;
        console.log('[VITAL SIGNS] Created record:', vitalSignsId);

        // Update queue status to completed
        console.log('[VITAL SIGNS] Updating queue status...');
        await db.query(`
            UPDATE queues 
            SET nurse_status = 'completed', vital_signs_id = ?
            WHERE id = ?
        `, [vitalSignsId, queue_id]);
        console.log('[VITAL SIGNS] Queue status updated');

        // Log audit
        logAudit(req, 'VITAL_SIGNS_RECORDED', {
            vital_signs_id: vitalSignsId,
            patient_id,
            queue_id,
            nurse_id: nurseId
        });

        console.log('[VITAL SIGNS] ✅ SUCCESS');
        res.status(201).json({
            message: 'Vital signs recorded successfully',
            vitalSignsId
        });

    } catch (error) {
        console.error('[VITAL SIGNS] ❌ ERROR:', error);
        console.error('[VITAL SIGNS] Error message:', error.message);
        console.error('[VITAL SIGNS] Error stack:', error.stack);
        res.status(500).json({
            error: 'Failed to record vital signs',
            details: error.message
        });
    }
});

// GET /api/nurses/patients/history - Get patient vital signs history
router.get('/patients/history', async (req, res) => {
    try {
        const history = await db.query(`
            SELECT 
                vs.*,
                pat.full_name as patient_name,
                pat.date_of_birth,
                pat.gender,
                a.appointment_date,
                a.appointment_time,
                q.queue_number
            FROM vital_signs vs
            JOIN patients pat ON vs.patient_id = pat.id
            LEFT JOIN appointments a ON vs.appointment_id = a.id
            LEFT JOIN queues q ON vs.queue_id = q.id
            ORDER BY vs.recorded_at DESC
            LIMIT 100
        `);

        res.json(history);

    } catch (error) {
        console.error('Get patient history error:', error);
        res.status(500).json({ error: 'Failed to fetch patient history' });
    }
});

// GET /api/nurses/patients/:id/vital-signs - Get specific patient's vital signs history
router.get('/patients/:id/vital-signs', async (req, res) => {
    try {
        const patientId = req.params.id;

        const vitalSigns = await db.query(`
            SELECT 
                vs.*,
                a.appointment_date
            FROM vital_signs vs
            LEFT JOIN appointments a ON vs.appointment_id = a.id
            WHERE vs.patient_id = ?
            ORDER BY vs.recorded_at DESC
        `, [patientId]);

        res.json(vitalSigns);

    } catch (error) {
        console.error('Get vital signs error:', error);
        res.status(500).json({ error: 'Failed to fetch vital signs' });
    }
});

// DELETE /api/nurses/queue/:id - Remove/Reject patient from queue
router.delete('/queue/:id', async (req, res) => {
    try {
        const queueId = req.params.id;

        // Update queue status to 'skipped' instead of deleting
        await db.query(`
            UPDATE queues 
            SET status = 'skipped', nurse_status = 'skipped'
            WHERE id = ?
        `, [queueId]);

        // Log audit
        logAudit(req, 'QUEUE_REJECTED', {
            queue_id: queueId
        });

        res.json({ message: 'Queue entry rejected successfully' });

    } catch (error) {
        console.error('Delete queue error:', error);
        res.status(500).json({ error: 'Failed to reject queue entry' });
    }
});

module.exports = router;
