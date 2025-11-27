const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const util = require('util');
const logFile = fs.createWriteStream(__dirname + '/server.log', { flags: 'a' });
const logStdout = process.stdout;

console.log = function (...args) {
    const msg = util.format(...args);
    logFile.write(msg + '\n');
    logStdout.write(msg + '\n');
};

console.error = function (...args) {
    const msg = util.format(...args);
    logFile.write(msg + '\n');
    logStdout.write(msg + '\n');
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Global Request Logger
app.use((req, res, next) => {
    const msg = `[SERVER] ${req.method} ${req.url}`;
    console.log(msg);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const paymentsRoutes = require('./routes/payments');
const pharmacyRoutes = require('./routes/pharmacy');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const queueRoutes = require('./routes/queue');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const medicinesRoutes = require('./routes/medicines');
const prescriptionsRoutes = require('./routes/prescriptions');
const prescriptionVerificationRoutes = require('./routes/prescription-verification');
const nursesRoutes = require('./routes/nurses');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/prescription-verification', prescriptionVerificationRoutes);
app.use('/api/nurses', nursesRoutes);
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/medical-records', require('./routes/medical-records'));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
