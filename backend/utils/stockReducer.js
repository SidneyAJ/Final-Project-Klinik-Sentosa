const db = require('../database');
const logAudit = require('./auditLogger');

/**
 * Reduce stock for medicines in a prescription
 * @param {Object} req - Express request object (for audit logging)
 * @param {number} prescriptionId - ID of the prescription
 * @returns {Promise<void>}
 */
async function reduceStockOnPayment(req, prescriptionId) {
    if (!prescriptionId) return;

    try {
        // Get prescription items (medicines) from prescription_items table
        const prescriptionItems = await db.query(
            'SELECT medicine_id, quantity FROM prescription_items WHERE prescription_id = ?',
            [prescriptionId]
        );

        if (!prescriptionItems || prescriptionItems.length === 0) {
            console.log(`No prescription items found for prescription ${prescriptionId}`);
            return;
        }

        // Reduce each medicine stock
        for (const item of prescriptionItems) {
            if (item.medicine_id && item.quantity) {
                await db.query(
                    'UPDATE medicines SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.medicine_id]
                );
                console.log(`Reduced stock for medicine ${item.medicine_id} by ${item.quantity}`);
            }
        }

        // Log audit
        logAudit(req, 'STOCK_REDUCED', {
            prescription_id: prescriptionId,
            medications_count: prescriptionItems.length,
            reason: 'Payment Verified / Lunas'
        });

        console.log(`✅ Stock reduced for prescription ${prescriptionId} (${prescriptionItems.length} items)`);

    } catch (error) {
        console.error('Error reducing stock:', error);
        throw error;
    }
}

module.exports = { reduceStockOnPayment };
