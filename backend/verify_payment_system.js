const axios = require('axios');
const db = require('./database');

const BASE_URL = 'http://localhost:3000/api';
let adminToken, patientToken, patientId, prescriptionId, medicineId;

async function login(email, password) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        return res.data.token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
}

async function runVerification() {
    console.log('🚀 Starting Payment System Verification...');

    try {
        // 1. Login as Admin
        console.log('\n1. Logging in as Admin...');
        adminToken = await login('admin@email.com', 'admin123'); // Assuming default admin
        console.log('✅ Admin logged in');

        // 2. Create a Medicine for testing stock reduction
        console.log('\n2. Creating Test Medicine...');
        const medicineRes = await axios.post(`${BASE_URL}/pharmacy/medicines`, {
            name: 'Obat Test Payment',
            category: 'Tablet',
            stock: 100,
            unit: 'Strip',
            price: 10000,
            expiry_date: '2025-12-31'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        medicineId = medicineRes.data.id;
        console.log(`✅ Medicine created (ID: ${medicineId}, Stock: 100)`);

        // 3. Register BPJS Patient
        console.log('\n3. Registering BPJS Patient...');
        const bpjsPatientData = {
            name: 'Pasien BPJS Test',
            email: `bpjs${Date.now()}@test.com`,
            username: `bpjs${Date.now()}`,
            password: 'password123',
            nik: `1234567890${Date.now().toString().slice(-6)}`,
            phone: '08123456789',
            address: 'Jl. Test BPJS',
            dob: '1990-01-01',
            gender: 'L',
            patient_type: 'bpjs',
            bpjs_number: '000123456789'
        };
        await axios.post(`${BASE_URL}/admin/patients`, bpjsPatientData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ BPJS Patient registered');

        // 4. Register Mandiri Patient
        console.log('\n4. Registering Mandiri Patient...');
        const mandiriPatientData = {
            name: 'Pasien Mandiri Test',
            email: `mandiri${Date.now()}@test.com`,
            username: `mandiri${Date.now()}`,
            password: 'password123',
            nik: `0987654321${Date.now().toString().slice(-6)}`,
            phone: '08123456789',
            address: 'Jl. Test Mandiri',
            dob: '1990-01-01',
            gender: 'P',
            patient_type: 'mandiri'
        };
        try {
            await axios.post(`${BASE_URL}/admin/patients`, mandiriPatientData, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Mandiri Patient registered');
        } catch (err) {
            console.error('Error registering Mandiri patient:', err.response?.data || err.message);
            throw err;
        }

        // Login as Mandiri Patient
        patientToken = await login(mandiriPatientData.email, 'password123');
        const profileRes = await axios.get(`${BASE_URL}/patients/profile`, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });
        patientId = profileRes.data.id;
        console.log(`✅ Mandiri Patient logged in (ID: ${patientId})`);

        // 5. Create Prescription for Mandiri Patient (Simulated via DB or Doctor API)
        // We'll insert directly to DB for speed, or use Doctor API if available.
        // Let's use DB direct insertion to ensure we have a prescription to pay.
        console.log('\n5. Creating Prescription for Mandiri Patient...');

        // Create prescription
        const presResult = await db.query(
            "INSERT INTO prescriptions (patient_id, doctor_id, status, created_at) VALUES (?, 2, 'pending', NOW())",
            [patientId]
        );
        prescriptionId = presResult.insertId; // Note: db.query returns [rows, fields] usually, but our wrapper might differ.
        // Wait, our db.query wrapper returns [rows]. Insert returns result object in mysql2.
        // Let's check database.js again. It uses pool.execute.
        // If it's insert, it returns [result]. result.insertId.
        // My wrapper: pool.execute(sql, params).then(([results]) => results);
        // So presResult is the result object.

        // Add items
        await db.query(
            "INSERT INTO prescription_items (prescription_id, medicine_id, quantity, dosage) VALUES (?, ?, 10, '3x1')",
            [prescriptionId, medicineId]
        );
        console.log(`✅ Prescription created (ID: ${prescriptionId})`);

        // 6. Patient Uploads Payment
        console.log('\n6. Patient Uploading Payment Proof...');
        const uploadRes = await axios.post(`${BASE_URL}/patients/payments/upload`, {
            prescription_id: prescriptionId,
            amount: 150000, // Arbitrary amount
            payment_proof: 'base64stringfake'
        }, { headers: { Authorization: `Bearer ${patientToken}` } });
        const paymentId = uploadRes.data.paymentId;
        console.log(`✅ Payment uploaded (ID: ${paymentId})`);

        // 7. Admin Verifies Payment
        console.log('\n7. Admin Verifying Payment...');
        await axios.put(`${BASE_URL}/payments/${paymentId}/verify`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Payment verified');

        // 8. Check Stock Reduction
        console.log('\n8. Checking Stock Reduction...');
        const [med] = await db.query('SELECT stock FROM medicines WHERE id = ?', [medicineId]);
        console.log(`Current Stock: ${med.stock}`);
        if (med.stock === 90) {
            console.log('✅ Stock reduced correctly (100 -> 90)');
        } else {
            console.error(`❌ Stock reduction failed! Expected 90, got ${med.stock}`);
        }

        // 9. Admin Manual Payment Test
        console.log('\n9. Testing Admin Manual Payment...');
        // Create another prescription
        const pres2 = await db.query(
            "INSERT INTO prescriptions (patient_id, doctor_id, status, created_at) VALUES (?, 2, 'pending', NOW())",
            [patientId]
        );
        const presId2 = pres2.insertId;
        await db.query(
            "INSERT INTO prescription_items (prescription_id, medicine_id, quantity, dosage) VALUES (?, ?, 5, '3x1')",
            [presId2, medicineId]
        );

        await axios.post(`${BASE_URL}/payments/create-manual`, {
            patient_id: patientId,
            prescription_id: presId2
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Manual payment created');

        // Check stock again
        const [med2] = await db.query('SELECT stock FROM medicines WHERE id = ?', [medicineId]);
        console.log(`Current Stock: ${med2.stock}`);
        if (med2.stock === 85) {
            console.log('✅ Stock reduced correctly (90 -> 85)');
        } else {
            console.error(`❌ Stock reduction failed! Expected 85, got ${med2.stock}`);
        }

        console.log('\n🎉 Verification Complete!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error);
    } finally {
        // Cleanup
        // await db.query('DELETE FROM medicines WHERE id = ?', [medicineId]);
        // await db.query('DELETE FROM users WHERE email LIKE "%@test.com"');
        process.exit();
    }
}

runVerification();
