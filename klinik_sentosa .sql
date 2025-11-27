-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 10:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `klinik_sentosa`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(23, 23, 2, '2025-11-25', '09:00:00', 'completed', 'Sakit Kepala', '2025-11-25 00:18:04', '2025-11-27 02:32:40'),
(24, 23, 2, '2025-11-25', '10:02:09', 'completed', 'Walk-in Queue', '2025-11-25 02:02:09', '2025-11-27 02:32:40'),
(25, 23, 2, '2025-11-25', '10:08:47', 'completed', 'Walk-in Queue', '2025-11-25 02:08:47', '2025-11-27 02:32:40'),
(26, 23, 2, '2025-11-25', '10:17:54', 'completed', 'Walk-in Queue', '2025-11-25 02:17:54', '2025-11-27 02:32:40'),
(27, 23, 2, '2025-11-25', '10:26:53', 'completed', 'Walk-in Queue', '2025-11-25 02:26:53', '2025-11-27 02:32:40'),
(28, 23, 2, '2025-11-27', '06:42:52', 'completed', 'Walk-in Queue', '2025-11-26 22:42:52', '2025-11-27 02:32:40'),
(29, 23, 3, '2025-11-27', '09:00:00', 'completed', 'saya pusing ,dingin', '2025-11-27 02:25:41', '2025-11-27 03:02:20'),
(30, 23, 3, '2025-11-27', '11:17:07', 'completed', 'Walk-in Queue', '2025-11-27 03:17:07', '2025-11-27 03:17:51'),
(31, 23, 3, '2025-11-27', '16:08:09', 'confirmed', 'Walk-in Queue', '2025-11-27 08:08:09', '2025-11-27 08:08:09'),
(32, 23, 3, '2025-11-27', '16:12:41', 'confirmed', 'Walk-in Queue', '2025-11-27 08:12:41', '2025-11-27 08:12:41'),
(33, 23, 2, '2025-11-27', '16:12:50', 'confirmed', 'Walk-in Queue', '2025-11-27 08:12:50', '2025-11-27 08:12:50'),
(34, 23, 2, '2025-11-27', '16:17:26', 'confirmed', 'Walk-in Queue', '2025-11-27 08:17:26', '2025-11-27 08:17:26'),
(35, 23, 3, '2025-11-27', '10:00:00', 'completed', '', '2025-11-27 09:10:58', '2025-11-27 09:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `full_name`, `specialization`, `license_number`, `phone`) VALUES
(2, 31, 'Dr. Steven Matar', NULL, NULL, NULL),
(3, 34, 'Dr. Brayndo Seon', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `diagnosis` text NOT NULL,
  `symptoms` text DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `patient_id`, `doctor_id`, `appointment_id`, `diagnosis`, `symptoms`, `treatment`, `notes`, `created_at`, `updated_at`) VALUES
(2, 23, 2, 23, 'Flu', NULL, 'Istirahat', 'Istirahat', '2025-11-25 00:23:51', '2025-11-25 00:23:51'),
(3, 23, 2, 28, 'Kecapeaan', 'Kejang Kejang', 'Operasi\n\n\n', '\nBanyak Berdoa', '2025-11-27 00:50:16', '2025-11-27 01:24:33'),
(4, 23, 3, 29, 'Kanker Otak', 'Pusing dan dingin dan hilang pendengaran', 'Operasi Tumor\n\nResep Obat:\n1. Betadine Solution - 1 tetes - 1x sehari selama 1 bulan\n', 'Bersiaplah', '2025-11-27 03:02:20', '2025-11-27 03:03:08'),
(5, 23, 3, 30, 'Kanker', 'sakit perut', 'Operasi', 'bersiaplah', '2025-11-27 03:18:58', '2025-11-27 03:18:58');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `minimum_stock` int(11) DEFAULT 10,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `description`, `stock`, `unit`, `price`, `minimum_stock`, `category`, `created_at`, `updated_at`, `expiry_date`) VALUES
(1, 'Paracetamol 500mg', 'Obat pereda nyeri dan penurun demam', 500, 'tablet', 500.00, 50, 'Analgesik', '2025-11-25 03:01:49', '2025-11-25 03:01:49', NULL),
(2, 'Amoxicillin 500mg', 'Antibiotik untuk infeksi bakteri', 300, 'kaplet', 2000.00, 30, 'Antibiotik', '2025-11-25 03:01:49', '2025-11-26 23:14:48', '2027-02-04'),
(3, 'OBH Batuk', 'Sirup obat batuk', 100, 'botol', 15000.00, 20, 'Batuk & Flu', '2025-11-25 03:01:49', '2025-11-26 23:25:32', '2025-11-14'),
(5, 'Vitamin C 1000mg', 'Suplemen vitamin C', 400, 'tablet', 80000.00, 100, 'Vitamin', '2025-11-25 03:01:49', '2025-11-26 23:33:27', NULL),
(6, 'Betadine Solution', 'Antiseptik luka', 49, 'botol', 25000.00, 10, 'Antiseptik', '2025-11-25 03:01:49', '2025-11-27 04:06:06', NULL),
(7, 'Salbutamol Inhaler', 'Obat asma', 30, 'box', 45000.00, 5, 'Pernapasan', '2025-11-25 03:01:49', '2025-11-27 00:12:16', '2026-02-27'),
(8, 'Omeprazole 20mg', 'Obat lambung', 250, 'kapsul', 3000.00, 30, 'Pencernaan', '2025-11-25 03:01:49', '2025-11-25 03:01:49', NULL),
(9, 'CTM 4mg', 'Antihistamin untuk alergi', 350, 'tablet', 100000.00, 50, 'Alergi', '2025-11-25 03:01:49', '2025-11-26 23:33:17', NULL),
(10, 'Diapet', 'Obat diare', 180, 'tablet', 1200.00, 50, 'Pencernaan', '2025-11-25 03:01:49', '2025-11-25 03:01:49', NULL),
(12, 'Decolgen', NULL, 100, 'strip', 15000.00, 10, 'Flu', '2025-11-26 23:17:17', '2025-11-27 00:12:16', '2025-11-21'),
(13, 'Ibuprofen 400mg', 'Pereda nyeri dan anti-inflamasi', 300, 'tablet', 800.00, 10, 'Analgesik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2027-03-01'),
(14, 'Asam Mefenamat 500mg', 'Nyeri gigi dan sakit kepala', 200, 'kaplet', 1000.00, 10, 'Analgesik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-01-02'),
(15, 'Neuralgin RX', 'Nyeri syaraf dan pegal linu', 150, 'kaplet', 2500.00, 10, 'Analgesik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2025-04-07'),
(16, 'Panadol Extra', 'Sakit kepala membandel', 100, 'box', 15000.00, 10, 'Analgesik', '2025-11-26 23:35:56', '2025-11-27 00:12:56', '2025-04-10'),
(17, 'Cefadroxil 500mg', 'Infeksi kulit dan tenggorokan', 250, 'kapsul', 3000.00, 10, 'Antibiotik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2025-04-27'),
(18, 'Azithromycin 500mg', 'Infeksi saluran pernapasan', 100, 'tablet', 15000.00, 10, 'Antibiotik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2027-11-05'),
(19, 'Ciprofloxacin 500mg', 'Infeksi saluran kemih', 150, 'tablet', 2500.00, 10, 'Antibiotik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2025-04-19'),
(20, 'Doxycycline 100mg', 'Infeksi bakteri umum', 120, 'kapsul', 1500.00, 10, 'Antibiotik', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-02-25'),
(21, 'OBH Combi Batuk Berdahak', 'Sirup obat batuk berdahak', 80, 'botol', 18000.00, 10, 'Batuk & Flu', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2027-05-30'),
(22, 'Siladex Antitussive', 'Batuk kering tidak berdahak', 60, 'botol', 22000.00, 10, 'Batuk & Flu', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-01-01'),
(23, 'Vicks Formula 44', 'Meredakan batuk dan flu', 70, 'botol', 25000.00, 10, 'Batuk & Flu', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-07-23'),
(24, 'Procold Flu & Batuk', 'Meringankan gejala flu', 200, 'pcs', 4000.00, 10, 'Batuk & Flu', '2025-11-26 23:35:56', '2025-11-27 00:06:02', '2027-12-11'),
(25, 'Enervon C', 'Multivitamin jaga daya tahan tubuh', 50, 'botol', 45000.00, 10, 'Vitamin', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-11-21'),
(26, 'Becomzet', 'Vitamin B Kompleks + Zinc', 80, 'strip', 25000.00, 10, 'Vitamin', '2025-11-26 23:35:56', '2025-11-27 00:12:16', '2027-11-06'),
(27, 'Vitacimin 500mg', 'Vitamin C hisap lemon', 500, 'tablet', 2000.00, 10, 'Vitamin', '2025-11-26 23:35:56', '2025-11-27 00:04:41', '2028-10-05'),
(28, 'Imboost Force', 'Immunomodulator', 60, 'pcs', 45000.00, 10, 'Vitamin', '2025-11-26 23:35:56', '2025-11-27 00:06:02', '2026-09-21'),
(29, 'Sangobion', 'Penambah darah', 150, 'kapsul', 2500.00, 10, 'Vitamin', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-08-13'),
(30, 'Promag', 'Obat sakit maag dan kembung', 300, 'pcs', 8000.00, 10, 'Pencernaan', '2025-11-26 23:35:56', '2025-11-27 00:06:02', '2025-06-07'),
(31, 'Mylanta Cair', 'Pereda nyeri lambung cepat', 40, 'botol', 45000.00, 10, 'Pencernaan', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-06-19'),
(32, 'Polysilane', 'Obat kembung dan maag', 100, 'tablet', 1500.00, 10, 'Pencernaan', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2025-07-26'),
(33, 'Entrostop', 'Obat diare anak dan dewasa', 120, 'strip', 9000.00, 10, 'Pencernaan', '2025-11-26 23:35:56', '2025-11-27 00:12:16', '2027-09-05'),
(34, 'Norit', 'Karbon aktif untuk keracunan/diare', 50, 'tube', 15000.00, 10, 'Pencernaan', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-06-12'),
(35, 'Amlodipine 5mg', 'Obat darah tinggi', 400, 'tablet', 1000.00, 10, 'Jantung & Hipertensi', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-02-19'),
(36, 'Amlodipine 10mg', 'Obat darah tinggi dosis tinggi', 10, 'tablet', 1500.00, 10, 'Jantung & Hipertensi', '2025-11-26 23:35:56', '2025-11-26 23:44:14', '2026-11-19'),
(37, 'Captopril 25mg', 'Hipertensi dan gagal jantung', 200, 'tablet', 500.00, 10, 'Jantung & Hipertensi', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-08-22'),
(38, 'Metformin 500mg', 'Obat diabetes tipe 2', 400, 'tablet', 800.00, 10, 'Diabetes', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2027-03-30'),
(39, 'Simvastatin 20mg', 'Penurun kolesterol jahat', 250, 'tablet', 1200.00, 10, 'Kolesterol', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2028-04-29'),
(40, 'Betadine Solution 30ml', 'Obat luka antiseptik', 10, 'botol', 35000.00, 10, 'Antiseptik', '2025-11-26 23:35:56', '2025-11-26 23:45:42', '2026-01-01'),
(41, 'Kalpanax Cair', 'Obat panu kadas kurap', 60, 'botol', 15000.00, 10, 'Kulit', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-02-12'),
(42, 'Counterpain 30g', 'Krim pereda nyeri otot', 30, 'tube', 45000.00, 10, 'Otot & Sendi', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2026-04-18'),
(43, 'Salonpas Koyo', 'Pereda pegal linu', 100, 'sachet', 12000.00, 10, 'Otot & Sendi', '2025-11-26 23:35:56', '2025-11-27 00:09:08', '2028-10-05'),
(44, 'Insto Regular', 'Tetes mata iritasi ringan', 80, 'botol', 15000.00, 10, 'Mata', '2025-11-26 23:35:56', '2025-11-26 23:35:56', '2027-11-29'),
(45, 'Antasida', NULL, 10, 'botol', 13000.00, 10, 'Pencernaan', '2025-11-26 23:51:49', '2025-11-27 04:06:59', '2026-01-13'),
(46, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:07:59', '2025-11-27 06:07:59', '2025-12-31'),
(47, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:08:43', '2025-11-27 06:08:43', '2025-12-31'),
(48, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:16:07', '2025-11-27 06:16:07', '2025-12-31'),
(49, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:21:24', '2025-11-27 06:21:24', '2025-12-31'),
(50, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:21:52', '2025-11-27 06:21:52', '2025-12-31'),
(51, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:22:56', '2025-11-27 06:22:56', '2025-12-31'),
(52, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:23:44', '2025-11-27 06:23:44', '2025-12-31'),
(53, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:24:10', '2025-11-27 06:24:10', '2025-12-31'),
(54, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:24:17', '2025-11-27 06:24:17', '2025-12-31'),
(55, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:25:21', '2025-11-27 06:25:21', '2025-12-31'),
(56, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:25:39', '2025-11-27 06:25:39', '2025-12-31'),
(57, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:26:57', '2025-11-27 06:26:57', '2025-12-31'),
(58, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:28:18', '2025-11-27 06:28:18', '2025-12-31'),
(59, 'Obat Test Payment', NULL, 100, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:30:39', '2025-11-27 06:30:39', '2025-12-31'),
(60, 'Obat Test Payment', NULL, 85, 'Strip', 10000.00, 10, 'Tablet', '2025-11-27 06:32:18', '2025-11-27 06:32:18', '2025-12-31');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nurses`
--

CREATE TABLE `nurses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nurses`
--

INSERT INTO `nurses` (`id`, `user_id`, `full_name`, `phone`, `specialization`, `created_at`) VALUES
(1, 17, 'Ns. Ratna Dewi', NULL, NULL, '2025-11-27 09:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `patient_type` enum('mandiri','bpjs') DEFAULT 'mandiri',
  `bpjs_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `full_name`, `nik`, `date_of_birth`, `gender`, `phone`, `address`, `blood_type`, `allergies`, `patient_type`, `bpjs_number`) VALUES
(23, 32, 'Darek Watak', '1213123132131313', '2025-11-05', 'laki-laki', '08112287223123', 'Manado', 'A', NULL, 'mandiri', NULL),
(24, 36, '', '1234567890679615', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(25, 37, '', '0987654321679686', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(26, 38, '', '1234567890723643', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(27, 39, '', '0987654321723708', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(28, 40, '', '1234567890167020', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(29, 41, '', '0987654321167091', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(30, 42, '', '1234567890484764', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(31, 43, '', '0987654321484829', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(32, 44, '', '1234567890512875', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(33, 45, '', '0987654321512941', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(34, 46, '', '1234567890576149', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(35, 47, '', '0987654321576214', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(36, 48, '', '1234567890624015', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(37, 49, '', '0987654321624080', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(38, 50, '', '1234567890650076', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(39, 51, '', '0987654321650145', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(40, 52, '', '1234567890657457', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(41, 53, '', '0987654321657525', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(42, 54, '', '1234567890721748', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(43, 55, '', '0987654321721813', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(44, 56, '', '1234567890739190', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(45, 57, '', '0987654321739255', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(46, 58, '', '1234567890817606', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(47, 59, '', '0987654321817672', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(48, 60, '', '1234567890898747', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(49, 61, '', '0987654321898810', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(50, 62, '', '1234567890039368', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(51, 63, '', '0987654321040593', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL),
(52, 64, '', '1234567890138513', '1990-01-01', 'L', '08123456789', 'Jl. Test BPJS', NULL, NULL, 'bpjs', '000123456789'),
(53, 65, '', '0987654321138610', '1990-01-01', 'P', '08123456789', 'Jl. Test Mandiri', NULL, NULL, 'mandiri', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','verified','rejected','paid','cancelled') DEFAULT 'pending',
  `payment_method` enum('cash','transfer','admin_manual','bpjs') DEFAULT 'cash',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `prescription_id` int(11) DEFAULT NULL,
  `payment_proof` text DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `patient_id`, `amount`, `status`, `payment_method`, `description`, `created_at`, `updated_at`, `prescription_id`, `payment_proof`, `verified_by`, `verified_at`, `notes`, `payment_date`) VALUES
(1, 49, 150000.00, 'verified', 'transfer', NULL, '2025-11-27 06:28:18', '2025-11-27 06:28:18', 16, 'base64stringfake', 1, '2025-11-27 14:28:18', 'Menunggu konfirmasi admin', '2025-11-27 14:28:18'),
(2, 49, 150000.00, 'verified', 'admin_manual', NULL, '2025-11-27 06:28:18', '2025-11-27 06:28:18', 17, NULL, 1, '2025-11-27 14:28:18', 'Pembayaran Manual via Admin', '2025-11-27 14:28:18'),
(3, 51, 150000.00, 'verified', 'transfer', NULL, '2025-11-27 06:30:41', '2025-11-27 06:30:41', 18, 'base64stringfake', 1, '2025-11-27 14:30:41', 'Menunggu konfirmasi admin', '2025-11-27 14:30:41'),
(4, 51, 150000.00, 'verified', 'admin_manual', NULL, '2025-11-27 06:30:41', '2025-11-27 06:30:41', 19, NULL, 1, '2025-11-27 14:30:41', 'Pembayaran Manual via Admin', '2025-11-27 14:30:41'),
(5, 53, 150000.00, 'verified', 'transfer', NULL, '2025-11-27 06:32:18', '2025-11-27 06:32:18', 20, 'base64stringfake', 1, '2025-11-27 14:32:18', 'Menunggu konfirmasi admin', '2025-11-27 14:32:18'),
(6, 53, 150000.00, 'verified', 'admin_manual', NULL, '2025-11-27 06:32:18', '2025-11-27 06:32:18', 21, NULL, 1, '2025-11-27 14:32:18', 'Pembayaran Manual via Admin', '2025-11-27 14:32:18'),
(7, 23, 163000.00, 'verified', 'transfer', NULL, '2025-11-27 06:58:23', '2025-11-27 06:58:23', 3, NULL, 999, '2025-11-27 14:58:23', 'Pembayaran Online Otomatis', '2025-11-27 14:58:23'),
(8, 23, 175000.00, 'verified', 'transfer', NULL, '2025-11-27 07:20:55', '2025-11-27 07:22:23', 2, NULL, 35, '2025-11-27 15:22:23', 'Menunggu verifikasi admin', '2025-11-27 15:20:55');

-- --------------------------------------------------------

--
-- Table structure for table `payment_items`
--

CREATE TABLE `payment_items` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `item_type` enum('examination','doctor','medicine','other') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_items`
--

INSERT INTO `payment_items` (`id`, `payment_id`, `item_type`, `description`, `quantity`, `unit_price`, `total_price`, `created_at`) VALUES
(1, 2, 'examination', 'Biaya Pemeriksaan', 1, 50000.00, 50000.00, '2025-11-27 06:28:18'),
(2, 2, 'doctor', 'Biaya Jasa Dokter', 1, 100000.00, 100000.00, '2025-11-27 06:28:18'),
(3, 4, 'examination', 'Biaya Pemeriksaan', 1, 50000.00, 50000.00, '2025-11-27 06:30:41'),
(4, 4, 'doctor', 'Biaya Jasa Dokter', 1, 100000.00, 100000.00, '2025-11-27 06:30:41'),
(5, 6, 'examination', 'Biaya Pemeriksaan', 1, 50000.00, 50000.00, '2025-11-27 06:32:18'),
(6, 6, 'doctor', 'Biaya Jasa Dokter', 1, 100000.00, 100000.00, '2025-11-27 06:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `pharmacists`
--

CREATE TABLE `pharmacists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pharmacists`
--

INSERT INTO `pharmacists` (`id`, `user_id`, `full_name`, `phone`, `license_number`, `created_at`) VALUES
(1, 33, 'Apt. Emil Waturandang', NULL, NULL, '2025-11-27 00:44:22');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `status` enum('pending','verified','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_price` decimal(10,2) DEFAULT 0.00,
  `processed_by` int(11) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `medications` text DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `dispensed` tinyint(1) DEFAULT 0,
  `dispensed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `patient_id`, `doctor_id`, `status`, `notes`, `created_at`, `updated_at`, `total_price`, `processed_by`, `processed_at`, `appointment_id`, `medications`, `verification_status`, `verified_by`, `verified_at`, `rejection_reason`, `dispensed`, `dispensed_at`) VALUES
(1, 23, 2, 'verified', NULL, '2025-11-27 02:20:40', '2025-11-27 04:06:59', 13000.00, NULL, NULL, 28, '[{\"name\":\"Antasida\",\"dosage\":\"1 ml\",\"frequency\":\"1x sehari\",\"duration\":\"1 minggu\"}]', 'pending', 33, '2025-11-27 04:06:59', NULL, 0, NULL),
(2, 23, 3, '', 'Diagnosis: Kanker Otak', '2025-11-27 03:02:20', '2025-11-27 07:22:23', 25000.00, NULL, NULL, 29, '[{\"medicine_id\":\"6\",\"name\":\"Betadine Solution\",\"unit\":\"botol\",\"quantity\":1,\"dosage\":\"1 tetes\",\"frequency\":\"1x sehari\",\"duration\":\"1 bulan\",\"id\":1764211639342}]', 'pending', 33, '2025-11-27 04:06:06', NULL, 0, NULL),
(3, 23, 3, 'verified', 'bersiaplah', '2025-11-27 03:18:58', '2025-11-27 04:05:28', 13000.00, NULL, NULL, 30, '[{\"name\":\"Antasida\",\"dosage\":\"1ml\",\"frequency\":\"1x sehari\",\"duration\":\"1 minggu\"}]', 'pending', 33, '2025-11-27 04:05:28', NULL, 0, NULL),
(5, 27, 2, 'pending', NULL, '2025-11-27 06:08:43', '2025-11-27 06:08:43', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(6, 29, 2, 'pending', NULL, '2025-11-27 06:16:07', '2025-11-27 06:16:07', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(7, 31, 2, 'pending', NULL, '2025-11-27 06:21:24', '2025-11-27 06:21:24', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(8, 33, 2, 'pending', NULL, '2025-11-27 06:21:53', '2025-11-27 06:21:53', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(9, 35, 2, 'pending', NULL, '2025-11-27 06:22:56', '2025-11-27 06:22:56', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(10, 37, 2, 'pending', NULL, '2025-11-27 06:23:44', '2025-11-27 06:23:44', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(11, 39, 2, 'pending', NULL, '2025-11-27 06:24:10', '2025-11-27 06:24:10', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(12, 41, 2, 'pending', NULL, '2025-11-27 06:24:17', '2025-11-27 06:24:17', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(13, 43, 2, 'pending', NULL, '2025-11-27 06:25:21', '2025-11-27 06:25:21', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(14, 45, 2, 'pending', NULL, '2025-11-27 06:25:39', '2025-11-27 06:25:39', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(15, 47, 2, '', NULL, '2025-11-27 06:26:57', '2025-11-27 07:23:53', 0.00, NULL, NULL, NULL, NULL, 'pending', 33, '2025-11-27 07:23:53', 'skip\n', 0, NULL),
(16, 49, 2, '', NULL, '2025-11-27 06:28:18', '2025-11-27 06:28:18', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(17, 49, 2, '', NULL, '2025-11-27 06:28:18', '2025-11-27 06:28:18', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(18, 51, 2, '', NULL, '2025-11-27 06:30:41', '2025-11-27 06:30:41', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(19, 51, 2, '', NULL, '2025-11-27 06:30:41', '2025-11-27 06:30:41', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(20, 53, 2, '', NULL, '2025-11-27 06:32:18', '2025-11-27 06:32:18', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL),
(21, 53, 2, '', NULL, '2025-11-27 06:32:18', '2025-11-27 06:32:18', 0.00, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prescription_items`
--

CREATE TABLE `prescription_items` (
  `id` int(11) NOT NULL,
  `prescription_id` int(11) NOT NULL,
  `medicine_id` int(11) DEFAULT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `dosage` varchar(100) DEFAULT NULL,
  `frequency` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescription_items`
--

INSERT INTO `prescription_items` (`id`, `prescription_id`, `medicine_id`, `medicine_name`, `quantity`, `dosage`, `frequency`, `duration`, `created_at`) VALUES
(1, 6, 48, '', 10, '3x1', NULL, NULL, '2025-11-27 06:16:07'),
(2, 7, 49, '', 10, '3x1', NULL, NULL, '2025-11-27 06:21:24'),
(3, 8, 50, '', 10, '3x1', NULL, NULL, '2025-11-27 06:21:53'),
(4, 9, 51, '', 10, '3x1', NULL, NULL, '2025-11-27 06:22:56'),
(5, 10, 52, '', 10, '3x1', NULL, NULL, '2025-11-27 06:23:44'),
(6, 11, 53, '', 10, '3x1', NULL, NULL, '2025-11-27 06:24:10'),
(7, 12, 54, '', 10, '3x1', NULL, NULL, '2025-11-27 06:24:17'),
(8, 13, 55, '', 10, '3x1', NULL, NULL, '2025-11-27 06:25:21'),
(9, 14, 56, '', 10, '3x1', NULL, NULL, '2025-11-27 06:25:39'),
(10, 15, 57, '', 10, '3x1', NULL, NULL, '2025-11-27 06:26:57'),
(11, 16, 58, '', 10, '3x1', NULL, NULL, '2025-11-27 06:28:18'),
(12, 17, 58, '', 5, '3x1', NULL, NULL, '2025-11-27 06:28:18'),
(13, 18, 59, '', 10, '3x1', NULL, NULL, '2025-11-27 06:30:41'),
(14, 19, 59, '', 5, '3x1', NULL, NULL, '2025-11-27 06:30:41'),
(15, 20, 60, '', 10, '3x1', NULL, NULL, '2025-11-27 06:32:18'),
(16, 21, 60, '', 5, '3x1', NULL, NULL, '2025-11-27 06:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `queues`
--

CREATE TABLE `queues` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `patient_name` varchar(255) NOT NULL,
  `queue_number` int(11) NOT NULL,
  `status` enum('waiting','serving','completed','skipped') DEFAULT 'waiting',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nurse_status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `vital_signs_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `queues`
--

INSERT INTO `queues` (`id`, `appointment_id`, `patient_name`, `queue_number`, `status`, `created_at`, `nurse_status`, `vital_signs_id`) VALUES
(10, 23, 'Darek Watak', 8, 'completed', '2025-11-25 00:18:04', 'pending', NULL),
(11, 24, 'Darek Watak', 9, 'completed', '2025-11-25 02:02:09', 'pending', NULL),
(12, 25, 'Darek Watak', 10, 'completed', '2025-11-25 02:08:47', 'pending', NULL),
(13, 26, 'Darek Watak', 11, 'completed', '2025-11-25 02:17:54', 'pending', NULL),
(14, 27, 'Darek Watak', 12, 'completed', '2025-11-25 02:26:53', 'pending', NULL),
(15, 28, 'Darek Watak', 1, 'skipped', '2025-11-26 22:42:52', '', NULL),
(16, 29, 'Darek Watak', 2, 'skipped', '2025-11-27 02:25:41', '', NULL),
(17, 30, 'Darek Watak', 3, 'skipped', '2025-11-27 03:17:07', '', NULL),
(18, 31, 'Darel Watak', 4, 'skipped', '2025-11-27 08:08:09', '', NULL),
(19, 32, 'Darel Watak', 4, 'skipped', '2025-11-27 08:12:41', '', NULL),
(20, 33, 'Darel Watak', 4, 'skipped', '2025-11-27 08:12:50', '', NULL),
(21, 34, 'Darel Watak', 4, 'skipped', '2025-11-27 08:17:26', '', NULL),
(22, 35, 'Darel Watak', 5, 'completed', '2025-11-27 09:10:58', 'completed', 8);

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `change_amount` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `prescription_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `role`, `name`, `created_at`) VALUES
(1, 'admin@email.com', NULL, '$2b$10$3HO5HNcHNQe2QMdikHJzn.Db6E41gukNPJHMc3MCJhWcttC0EYeqe', 'admin', 'IT_Administrator', '2025-11-22 10:16:39'),
(17, 'nurse@email.com', NULL, '$2b$10$MKVo6f8SjV3njZt9zxebpu5cxGgRHIflXlnZg4H32G51z65I3RkRS', 'nurse', 'Ns. Ratna Dewi', '2025-11-22 20:59:39'),
(18, 'Jayden@email.com', NULL, '$2b$10$3HO5HNcHNQe2QMdikHJzn.Db6E41gukNPJHMc3MCJhWcttC0EYeqe', 'pharmacist', 'Apt. Jayden Sangari', '2025-11-22 22:41:46'),
(19, 'owner@klinik.com', NULL, '$2b$10$3HO5HNcHNQe2QMdikHJzn.Db6E41gukNPJHMc3MCJhWcttC0EYeqe', 'owner', 'Stevanus Bojoh', '2025-11-22 23:13:24'),
(31, 'Steven@email.com', NULL, '$2b$10$z6J1zC1sB5yHkXaPwVnVnOlRpvR6lI5viaabb/tO5pj7QKkJzmvgy', 'doctor', 'Dr. Steven Matar', '2025-11-24 15:17:14'),
(32, 'derel@email.com', 'Derel', '$2b$10$pLpEx5PB71z78gG3EJOcNOSuecov9QfAducEDWVru1YS3AloB9XVe', 'patient', 'Darel Watak', '2025-11-25 00:17:01'),
(33, 'Emil@email.com', 'Emil', '$2b$10$Kb.Z1eZoCt02uuwalVVTfO2qJYxJ707IUy4NJ9CoLYqw9hg2jcAkG', 'pharmacist', 'Apt. Emil Waturandang', '2025-11-27 00:44:22'),
(34, 'Seon@email.com', 'Seon', '$2b$10$mrMOxSZZ2t9rOWnfhJw61eQDRKyfHpf.dZrsgTN0owiUt0E9os0aS', 'doctor', 'Dr. Brayndo Seon', '2025-11-27 00:46:32'),
(35, 'Fael@email.com', 'Fael', '$2b$10$Sm4u8T91mVkRBhvE3VsHvuZpkM4trcKHw21pUPLhkUSkXotKpKjmq', 'admin', 'Rafael Kristanto', '2025-11-27 04:19:09'),
(36, 'bpjs1764223679615@test.com', 'bpjs1764223679615', '$2b$10$GIAUNiz4e5Ft.GaH86wppOk5nh6zl5mVbplqWKwQfoIYrEQR4FII2', 'patient', 'Pasien BPJS Test', '2025-11-27 06:07:59'),
(37, 'mandiri1764223679686@test.com', 'mandiri1764223679686', '$2b$10$wTM9RQa6N7Z0eltjsiMWUeP00yY94QetPdMH0gsiKT3j8PMNj8EoC', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:07:59'),
(38, 'bpjs1764223723643@test.com', 'bpjs1764223723643', '$2b$10$XOcPQCYQLInTpWfUyO8KvuZl8Q8c0z.VRBtpiu9QsTmJWvu8OJaoK', 'patient', 'Pasien BPJS Test', '2025-11-27 06:08:43'),
(39, 'mandiri1764223723708@test.com', 'mandiri1764223723708', '$2b$10$cjine4dsB41aiL1m8OAkE.O50laqbm/Y2x9s0jZ/4UZL0.BYwsZRy', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:08:43'),
(40, 'bpjs1764224167020@test.com', 'bpjs1764224167020', '$2b$10$Kx8pJZ1hStYXd/68s2a8Xe9rC4whKQtBiAxdtukcJ6uYqESMGnnRu', 'patient', 'Pasien BPJS Test', '2025-11-27 06:16:07'),
(41, 'mandiri1764224167091@test.com', 'mandiri1764224167091', '$2b$10$c0zIkj2zm2HnSPsgJrqyFOVHARFuW/uKhv71TvdKzK6nVUbWNPtEq', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:16:07'),
(42, 'bpjs1764224484764@test.com', 'bpjs1764224484764', '$2b$10$doYOPwELMm1VLxVsorbEj.y7Oc9ImW84iLbAcAlQyAwuBugOIq6AC', 'patient', 'Pasien BPJS Test', '2025-11-27 06:21:24'),
(43, 'mandiri1764224484829@test.com', 'mandiri1764224484829', '$2b$10$n.nu57A8nPxLA8MIe.IhaezLcRjIYn8imvXhKYjkj6amrbDOgyrca', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:21:24'),
(44, 'bpjs1764224512875@test.com', 'bpjs1764224512875', '$2b$10$Qw.357kywBE1g3tqgp4iIOAFmtcz7YkJPZkavnMUr559GzvHtVSoG', 'patient', 'Pasien BPJS Test', '2025-11-27 06:21:52'),
(45, 'mandiri1764224512941@test.com', 'mandiri1764224512941', '$2b$10$Pz6qX/cic.AWL6MSnKRd.OA2FZTTzalXoXQ02ZTQrGh4ySrh3gfIy', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:21:52'),
(46, 'bpjs1764224576149@test.com', 'bpjs1764224576149', '$2b$10$TB8.Yc65TUgOhKIiiTVRK.TdyR3tp4alafsdB0qa4IXL2Dn.6jzIS', 'patient', 'Pasien BPJS Test', '2025-11-27 06:22:56'),
(47, 'mandiri1764224576214@test.com', 'mandiri1764224576214', '$2b$10$vREwwcdL8US0Wjcqiiy1o.TsCtVWVw7y/1qhVox6x5eFaTK5AaaPu', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:22:56'),
(48, 'bpjs1764224624015@test.com', 'bpjs1764224624015', '$2b$10$/LxbVxO5rBPruPbAgzoYQ.BSVzcv7uGfAI33b9J6sN96iC9yu31oe', 'patient', 'Pasien BPJS Test', '2025-11-27 06:23:44'),
(49, 'mandiri1764224624080@test.com', 'mandiri1764224624080', '$2b$10$FQA3.dhcXIVoMwXAJp7T1.Ymo9FyCBuxR0lNRSS4fEoplerJEZ4EC', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:23:44'),
(50, 'bpjs1764224650076@test.com', 'bpjs1764224650076', '$2b$10$wdJaU4uPVJehSuZpMcG2ce9Fx6H9p/9eqk7oGU6jMj/LyyoDTl9bi', 'patient', 'Pasien BPJS Test', '2025-11-27 06:24:10'),
(51, 'mandiri1764224650145@test.com', 'mandiri1764224650145', '$2b$10$4pM1A1VjaJVL8AdXbvcHVOegv0n4rzCtZdL5RO3YB/akmTWcD.pfC', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:24:10'),
(52, 'bpjs1764224657457@test.com', 'bpjs1764224657457', '$2b$10$KPzYyU9yBnlHxe43u9PCJ.GaiehBev1mM7OibQSvp6inVpay9aewq', 'patient', 'Pasien BPJS Test', '2025-11-27 06:24:17'),
(53, 'mandiri1764224657525@test.com', 'mandiri1764224657525', '$2b$10$1.i6DjZSSIH2zrEZNW6FuuJTg1FkHeW0nu0DHq5AbI7eY/fayJw4e', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:24:17'),
(54, 'bpjs1764224721748@test.com', 'bpjs1764224721748', '$2b$10$K./qhQb7ftMeBZUww21u6OHpFUE9CuOdWMbyplXKkcI2y1NgL6Mua', 'patient', 'Pasien BPJS Test', '2025-11-27 06:25:21'),
(55, 'mandiri1764224721813@test.com', 'mandiri1764224721813', '$2b$10$hLxUU7zLe0pmlYdh2BfApuu7snWUgzvfk4YDCvJDLKrlR5wfnBkHi', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:25:21'),
(56, 'bpjs1764224739190@test.com', 'bpjs1764224739190', '$2b$10$KQFVpPT6IYZRFN3r8OJiz.ar9KC/WMxhf0HmS0um26bAfX3yanU8.', 'patient', 'Pasien BPJS Test', '2025-11-27 06:25:39'),
(57, 'mandiri1764224739255@test.com', 'mandiri1764224739255', '$2b$10$zqd2HLEdnu/g5P384mhjnOglNBLxCizJjJLlLYz.Mf7UcyxMi4BhG', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:25:39'),
(58, 'bpjs1764224817606@test.com', 'bpjs1764224817606', '$2b$10$NSN7hpi7U4TA2b5236BUV.sEfrXkzPlyDGmZCWId9rPm5ndoYx4Wu', 'patient', 'Pasien BPJS Test', '2025-11-27 06:26:57'),
(59, 'mandiri1764224817672@test.com', 'mandiri1764224817672', '$2b$10$OGzrjNaAdvqTc2dAaX/YhuZSEo/J86emh0dh9fAQ26WC/aPSxVAGq', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:26:57'),
(60, 'bpjs1764224898747@test.com', 'bpjs1764224898747', '$2b$10$oM7z4SWXUSpPu4v/OeptP.OTMdZWCd7Fkn4xCiy75Az0XaW9bWZFS', 'patient', 'Pasien BPJS Test', '2025-11-27 06:28:18'),
(61, 'mandiri1764224898810@test.com', 'mandiri1764224898810', '$2b$10$JnrRgLqGJetvqzaUsR4APuQKnu4vh0mQactAl8eLFijP1qG.tQejO', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:28:18'),
(62, 'bpjs1764225039368@test.com', 'bpjs1764225039368', '$2b$10$Lr3tQ3gqT94fev97ZnoQZe.wyRW5mjOxL31gy3Zl1ysNF1Yce7GQm', 'patient', 'Pasien BPJS Test', '2025-11-27 06:30:40'),
(63, 'mandiri1764225040593@test.com', 'mandiri1764225040593', '$2b$10$TR3fH83Sgiz4zpbPVfY5iuqSHglH0RZP57u2/eHdJxQpjxlI9GzzC', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:30:40'),
(64, 'bpjs1764225138513@test.com', 'bpjs1764225138513', '$2b$10$AF2UTGzJJ3fN.oBdMyD0PuQlYy5nzjRzymLAHFBD7te0Cw4OCt/V.', 'patient', 'Pasien BPJS Test', '2025-11-27 06:32:18'),
(65, 'mandiri1764225138610@test.com', 'mandiri1764225138610', '$2b$10$uWhEv1YbkvLcRXhj6PNeROPucXMKBDtGb35nTQW69euLv4pfP1faa', 'patient', 'Pasien Mandiri Test', '2025-11-27 06:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `vital_signs`
--

CREATE TABLE `vital_signs` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `queue_id` int(11) DEFAULT NULL,
  `nurse_id` int(11) NOT NULL,
  `blood_pressure_systolic` int(11) DEFAULT NULL,
  `blood_pressure_diastolic` int(11) DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `blood_type` varchar(5) DEFAULT NULL,
  `oxygen_saturation` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vital_signs`
--

INSERT INTO `vital_signs` (`id`, `patient_id`, `appointment_id`, `queue_id`, `nurse_id`, `blood_pressure_systolic`, `blood_pressure_diastolic`, `heart_rate`, `temperature`, `weight`, `height`, `blood_type`, `oxygen_saturation`, `notes`, `recorded_at`) VALUES
(8, 23, 35, 22, 1, 11, 11, 10, 11.0, 11.00, 10.90, 'B', 98, '11', '2025-11-27 09:24:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `idx_date` (`appointment_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_specialization` (`specialization`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`);

--
-- Indexes for table `nurses`
--
ALTER TABLE `nurses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD KEY `idx_full_name` (`full_name`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `payment_items`
--
ALTER TABLE `payment_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `pharmacists`
--
ALTER TABLE `pharmacists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `fk_verified_by` (`verified_by`);

--
-- Indexes for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescription_id` (`prescription_id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indexes for table `queues`
--
ALTER TABLE `queues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `vital_signs_id` (`vital_signs_id`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medicine_id` (`medicine_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `prescription_id` (`prescription_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `vital_signs`
--
ALTER TABLE `vital_signs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `nurse_id` (`nurse_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `queue_id` (`queue_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nurses`
--
ALTER TABLE `nurses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment_items`
--
ALTER TABLE `payment_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pharmacists`
--
ALTER TABLE `pharmacists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `prescription_items`
--
ALTER TABLE `prescription_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `queues`
--
ALTER TABLE `queues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `vital_signs`
--
ALTER TABLE `vital_signs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nurses`
--
ALTER TABLE `nurses`
  ADD CONSTRAINT `nurses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

--
-- Constraints for table `payment_items`
--
ALTER TABLE `payment_items`
  ADD CONSTRAINT `payment_items_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pharmacists`
--
ALTER TABLE `pharmacists`
  ADD CONSTRAINT `pharmacists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `fk_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`);

--
-- Constraints for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD CONSTRAINT `prescription_items_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prescription_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `queues`
--
ALTER TABLE `queues`
  ADD CONSTRAINT `queues_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `queues_ibfk_2` FOREIGN KEY (`vital_signs_id`) REFERENCES `vital_signs` (`id`);

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `stock_history_ibfk_1` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_history_ibfk_3` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `vital_signs`
--
ALTER TABLE `vital_signs`
  ADD CONSTRAINT `vital_signs_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `vital_signs_ibfk_2` FOREIGN KEY (`nurse_id`) REFERENCES `nurses` (`id`),
  ADD CONSTRAINT `vital_signs_ibfk_3` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `vital_signs_ibfk_4` FOREIGN KEY (`queue_id`) REFERENCES `queues` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
