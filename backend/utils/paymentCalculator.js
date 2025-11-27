/**
 * Calculate total payment breakdown
 * @param {Object} prescription - Prescription object with total_price
 * @param {string} patientType - 'mandiri' or 'bpjs'
 * @returns {Object} Payment breakdown
 */
function calculatePaymentTotal(prescription, patientType = 'mandiri') {
    // BPJS is free
    if (patientType === 'bpjs') {
        return {
            exam_fee: 0,
            doctor_fee: 0,
            medicine_fee: 0,
            total: 0,
            items: []
        };
    }

    let total = 0;
    const items = [];

    // 1. Exam fee (Biaya Pemeriksaan)
    const examFee = 50000;
    total += examFee;
    items.push({
        item_type: 'examination',
        description: 'Biaya Pemeriksaan',
        quantity: 1,
        unit_price: examFee,
        total_price: examFee
    });

    // 2. Doctor fee (Biaya Dokter)
    const doctorFee = 100000;
    total += doctorFee;
    items.push({
        item_type: 'doctor',
        description: 'Biaya Jasa Dokter',
        quantity: 1,
        unit_price: doctorFee,
        total_price: doctorFee
    });

    // 3. Medicine fee (Biaya Obat)
    const medicineFee = parseFloat(prescription?.total_price || 0);
    if (medicineFee > 0) {
        total += medicineFee;
        items.push({
            item_type: 'medicine',
            description: 'Biaya Obat-obatan (Resep)',
            quantity: 1,
            unit_price: medicineFee,
            total_price: medicineFee
        });
    }

    return {
        exam_fee: examFee,
        doctor_fee: doctorFee,
        medicine_fee: medicineFee,
        total: total,
        items: items
    };
}

module.exports = { calculatePaymentTotal };
