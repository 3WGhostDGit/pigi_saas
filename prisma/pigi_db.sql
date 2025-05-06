-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2025 at 10:53 AM
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
-- Database: `pigi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `providerAccountId` varchar(255) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`) VALUES
('acc_grace_google', 'user_dev_02', 'oauth', 'google', 'google_user_id_for_grace', 'some_refresh_token', 'some_access_token', 1745947348, 'Bearer', 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', 'some_id_token', 'some_session_state');

-- --------------------------------------------------------

--
-- Table structure for table `benefits`
--

CREATE TABLE `benefits` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `costPerMonth` decimal(8,2) DEFAULT NULL,
  `employeeContribution` decimal(8,2) DEFAULT NULL,
  `companyContribution` decimal(8,2) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parentId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `parentId`) VALUES
('dept_dev', 'Développement Logiciel', 'Software development team', 'dept_tech'),
('dept_dg', 'Direction Générale', 'Top level management', NULL),
('dept_fin', 'Finance', 'Finance and Accounting department', 'dept_dg'),
('dept_ops', 'Opérations IT', 'IT Operations and Infrastructure', 'dept_tech'),
('dept_rh', 'Ressources Humaines', 'Human Resources department', 'dept_dg'),
('dept_tech', 'Technologie', 'Engineering and IT department', 'dept_dg');

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contacts`
--

CREATE TABLE `emergency_contacts` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_benefits`
--

CREATE TABLE `employee_benefits` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `benefitId` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_contracts`
--

CREATE TABLE `employee_contracts` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `contractType` enum('PERMANENT','FIXED_TERM','INTERNSHIP','APPRENTICESHIP','FREELANCE') NOT NULL,
  `status` enum('ACTIVE','ENDED','PENDING','TERMINATED') NOT NULL DEFAULT 'ACTIVE',
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `jobTitle` varchar(255) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'EUR',
  `workingHours` double DEFAULT NULL,
  `trialPeriodEndDate` date DEFAULT NULL,
  `contractUrl` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `documentType` enum('ID_CARD','PASSPORT','RESIDENCE_PERMIT','CONTRACT','CERTIFICATE','PAYSLIP','OTHER') NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileUrl` text NOT NULL,
  `description` text DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `uploadedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_trainings`
--

CREATE TABLE `employee_trainings` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `trainingId` varchar(255) NOT NULL,
  `status` enum('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED','FAILED') NOT NULL DEFAULT 'PLANNED',
  `completionDate` date DEFAULT NULL,
  `score` double DEFAULT NULL,
  `certificateUrl` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `leaveTypeId` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approverId` varchar(255) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `userId`, `leaveTypeId`, `startDate`, `endDate`, `reason`, `status`, `createdAt`, `updatedAt`, `approverId`, `approvedAt`) VALUES
('leave_req_01', 'user_dev_01', 'f53a0b0b-2453-11f0-95f9-3', '2025-05-10', '2025-05-15', 'Vacances annuelles', 'APPROVED', '2025-04-19 09:22:28', '2025-04-24 09:22:28', 'user_dev_lead_01', '2025-04-24 09:22:28'),
('leave_req_02', 'user_dev_02', 'f53a0b0b-2453-11f0-95f9-3', '2025-06-01', '2025-06-10', 'Voyage prévu', 'PENDING', '2025-04-27 09:22:28', '2025-04-27 09:22:28', 'user_dev_lead_01', NULL),
('leave_req_03', 'user_ops_01', 'f53a13fa-2453-11f0-95f9-3', '2025-04-28', '2025-04-30', 'Grippe', 'APPROVED', '2025-04-28 08:30:00', '2025-04-28 10:00:00', 'user_tech_mgr_01', '2025-04-28 10:00:00'),
('leave_req_04', 'user_fin_01', 'f53a14e0-2453-11f0-95f9-3', '2025-05-05', '2025-05-05', 'Récupération heures supplémentaires', 'PENDING', '2025-04-28 09:22:28', '2025-04-28 09:22:28', 'user_fin_mgr_01', NULL),
('leave_req_05', 'user_dev_lead_01', 'f53a0b0b-2453-11f0-95f9-3', '2025-07-01', '2025-07-05', 'Congés été', 'APPROVED', '2025-04-14 09:22:28', '2025-04-17 09:22:28', 'user_tech_mgr_01', '2025-04-17 09:22:28'),
('leave_req_06', 'user_dev_01', 'f53a0b0b-2453-11f0-95f9-3', '2025-08-10', '2025-08-12', 'Weekend prolongé', 'REJECTED', '2025-04-24 09:22:28', '2025-04-26 09:22:28', 'user_dev_lead_01', '2025-04-26 09:22:28'),
('leave_req_07', 'cma2mxqzx0000vgmo3pd8wzy2', 'f53a14e0-2453-11f0-95f9-3', '2025-05-20', '2025-05-20', 'RTT', 'PENDING', '2025-04-29 08:22:28', '2025-04-29 08:22:28', 'user_hr_mgr_01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `description`) VALUES
('f53a0b0b-2453-11f0-95f9-3', 'Congé Payé', 'Congés annuels payés'),
('f53a13fa-2453-11f0-95f9-3', 'Maladie', 'Absence pour cause de maladie (justificatif requis)'),
('f53a14e0-2453-11f0-95f9-3', 'RTT', 'Jour de Récupération du Temps de Travail');

-- --------------------------------------------------------

--
-- Table structure for table `performance_reviews`
--

CREATE TABLE `performance_reviews` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `reviewerId` varchar(255) NOT NULL,
  `reviewDate` date NOT NULL,
  `periodStartDate` date NOT NULL,
  `periodEndDate` date NOT NULL,
  `rating` enum('POOR','NEEDS_IMPROVEMENT','MEETS_EXPECTATIONS','EXCEEDS_EXPECTATIONS','OUTSTANDING') NOT NULL,
  `strengths` text DEFAULT NULL,
  `weaknesses` text DEFAULT NULL,
  `goals` text DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `action`, `subject`, `description`) VALUES
('perm_approve_leave', 'approve', 'LeaveRequest', 'Approve or reject leave requests (typically for managers)'),
('perm_create_leave', 'create', 'LeaveRequest', 'Create own leave requests'),
('perm_manage_all', 'manage', 'all', 'Full control over all resources'),
('perm_manage_all_leave', 'manage', 'AllLeaveRequest', 'Manage all leave requests (typically for HR/Admin)'),
('perm_manage_department', 'manage', 'Department', 'Create, update, delete departments'),
('perm_manage_leave_type', 'manage', 'LeaveType', 'Create, update, delete leave types'),
('perm_manage_own_leave', 'manage', 'OwnLeaveRequest', 'Create, update, cancel own leave requests'),
('perm_manage_permission', 'manage', 'Permission', 'Create, update, delete permissions'),
('perm_manage_role', 'manage', 'Role', 'Create, update, delete roles and assign permissions'),
('perm_manage_user', 'manage', 'User', 'Create, update, delete users'),
('perm_read_department', 'read', 'Department', 'Read department information'),
('perm_read_leave_type', 'read', 'LeaveType', 'Read leave type information'),
('perm_read_own_leave', 'read', 'OwnLeaveRequest', 'Read own leave requests'),
('perm_read_permission', 'read', 'Permission', 'Read permission information'),
('perm_read_role', 'read', 'Role', 'Read role information'),
('perm_read_team_leave', 'read', 'TeamLeaveRequest', 'Read leave requests of direct reports'),
('perm_read_user', 'read', 'User', 'Read user information');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('cma2p6z590000vgpczosjgu8k', 'ADMIN', 'Administrateur de la plateforme PIGI'),
('cma2p6z7m0001vgpc0vhxgczs', 'EMPLOYEE', 'Employé standard'),
('cma2p6z9g0002vgpcigxoi6wi', 'MANAGER', 'Manager d\'équipe');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `roleId` varchar(255) NOT NULL,
  `permissionId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`roleId`, `permissionId`) VALUES
('cma2p6z590000vgpczosjgu8k', 'perm_manage_all'),
('cma2p6z7m0001vgpc0vhxgczs', 'perm_manage_own_leave'),
('cma2p6z7m0001vgpc0vhxgczs', 'perm_read_department'),
('cma2p6z7m0001vgpc0vhxgczs', 'perm_read_leave_type'),
('cma2p6z7m0001vgpc0vhxgczs', 'perm_read_user'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_approve_leave'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_manage_own_leave'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_read_department'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_read_leave_type'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_read_team_leave'),
('cma2p6z9g0002vgpcigxoi6wi', 'perm_read_user');

-- --------------------------------------------------------

--
-- Table structure for table `salary_history`
--

CREATE TABLE `salary_history` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'EUR',
  `effectiveDate` date NOT NULL,
  `reason` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `sessionToken` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `expires` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `sessionToken`, `userId`, `expires`) VALUES
('sess_frank_active', 'unique_session_token_for_frank', 'user_dev_01', '2025-04-30 09:22:28');

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE `trainings` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `cost` decimal(8,2) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `isMandatory` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `emailVerified` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `hashedPassword` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `departmentId` varchar(255) DEFAULT NULL,
  `jobTitle` varchar(255) DEFAULT NULL,
  `managerId` varchar(255) DEFAULT NULL,
  `entryDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `emailVerified`, `image`, `hashedPassword`, `createdAt`, `updatedAt`, `departmentId`, `jobTitle`, `managerId`, `entryDate`) VALUES
('cma2mxqzx0000vgmo3pd8wzy2', 'Trek Nomade', 'nowmanifest2@gmail.com', NULL, NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 15:01:32', '2025-04-29 09:22:28', 'dept_rh', 'Manager RH Adjoint', 'user_hr_mgr_01', '2021-03-01 09:00:00'),
('cma4zib5r0000vgsolbh9mf49', 'Treks', 'Treksrichard@pigi.example.com', NULL, NULL, '$2a$10$7KjgXJLLMK4OgDdswISvGO4Ibsje/qf/zQv7BJOU9eGhcDIU5VCLe', '2025-05-01 06:28:59', '2025-05-01 06:28:59', NULL, NULL, NULL, NULL),
('user_ceo_01', 'Alice Dubois', 'alice.dubois@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:22:43', 'dept_dg', 'Directrice Générale', NULL, '2018-01-15 09:00:00'),
('user_dev_01', 'Frank Richard', 'frank.richard@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:22:46', 'dept_dev', 'Développeur Senior', 'user_dev_lead_01', '2021-05-20 09:00:00'),
('user_dev_02', 'Grace Girard', 'grace.girard@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:22:49', 'dept_dev', 'Développeuse Junior', 'user_dev_lead_01', '2023-08-01 09:00:00'),
('user_dev_lead_01', 'Eve Moreau', 'eve.moreau@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:22:54', 'dept_dev', 'Lead Développeur', 'user_tech_mgr_01', '2020-01-15 09:00:00'),
('user_fin_01', 'Ivan Laurent', 'ivan.laurent@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:22:57', 'dept_fin', 'Comptable', 'user_fin_mgr_01', '2022-02-10 09:00:00'),
('user_fin_mgr_01', 'Carole Petit', 'carole.petit@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:23:00', 'dept_fin', 'Directrice Financière', 'user_ceo_01', '2018-06-20 09:00:00'),
('user_hr_mgr_01', 'David Lefebvre', 'david.lefebvre@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:23:03', 'dept_rh', 'Responsable RH', 'user_ceo_01', '2020-09-01 09:00:00'),
('user_ops_01', 'Heidi Simon', 'heidi.simon@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:23:07', 'dept_ops', 'Ingénieur Système', 'user_tech_mgr_01', '2021-11-01 09:00:00'),
('user_tech_mgr_01', 'Bob Martin', 'bob.martin@pigi.example.com', '2025-04-29 09:22:28', NULL, '$2a$10$y.4MXeABbEz7vkQv7u9pDOwgaOT0X4IvwqXATeM5LCTsa5xSP77vu', '2025-04-29 09:22:28', '2025-04-29 09:23:10', 'dept_tech', 'Directeur Technique', 'user_ceo_01', '2019-03-10 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `userId` varchar(255) NOT NULL,
  `roleId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`userId`, `roleId`) VALUES
('cma2mxqzx0000vgmo3pd8wzy2', 'cma2p6z9g0002vgpcigxoi6wi'),
('user_ceo_01', 'cma2p6z590000vgpczosjgu8k'),
('user_ceo_01', 'cma2p6z9g0002vgpcigxoi6wi'),
('user_dev_01', 'cma2p6z7m0001vgpc0vhxgczs'),
('user_dev_02', 'cma2p6z7m0001vgpc0vhxgczs'),
('user_dev_lead_01', 'cma2p6z9g0002vgpcigxoi6wi'),
('user_fin_01', 'cma2p6z7m0001vgpc0vhxgczs'),
('user_fin_mgr_01', 'cma2p6z9g0002vgpcigxoi6wi'),
('user_hr_mgr_01', 'cma2p6z9g0002vgpcigxoi6wi'),
('user_ops_01', 'cma2p6z7m0001vgpc0vhxgczs'),
('user_tech_mgr_01', 'cma2p6z9g0002vgpcigxoi6wi');

-- --------------------------------------------------------

--
-- Table structure for table `verification_tokens`
--

CREATE TABLE `verification_tokens` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `verification_tokens`
--

INSERT INTO `verification_tokens` (`identifier`, `token`, `expires`) VALUES
('frank.richard@pigi.example.com', 'unique_verification_token_for_frank', '2025-04-29 10:22:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `accounts_userId_fkey` (`userId`);

--
-- Indexes for table `benefits`
--
ALTER TABLE `benefits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `benefits_name_key` (`name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_name_key` (`name`),
  ADD KEY `departments_parentId_idx` (`parentId`);

--
-- Indexes for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emergency_contacts_userId_idx` (`userId`);

--
-- Indexes for table `employee_benefits`
--
ALTER TABLE `employee_benefits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_benefits_userId_benefitId_key` (`userId`,`benefitId`),
  ADD KEY `employee_benefits_userId_idx` (`userId`),
  ADD KEY `employee_benefits_benefitId_idx` (`benefitId`);

--
-- Indexes for table `employee_contracts`
--
ALTER TABLE `employee_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_contracts_userId_idx` (`userId`),
  ADD KEY `employee_contracts_status_idx` (`status`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_documents_userId_idx` (`userId`),
  ADD KEY `employee_documents_documentType_idx` (`documentType`);

--
-- Indexes for table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_trainings_userId_trainingId_key` (`userId`,`trainingId`),
  ADD KEY `employee_trainings_userId_idx` (`userId`),
  ADD KEY `employee_trainings_trainingId_idx` (`trainingId`),
  ADD KEY `employee_trainings_status_idx` (`status`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_requests_userId_idx` (`userId`),
  ADD KEY `leave_requests_leaveTypeId_idx` (`leaveTypeId`),
  ADD KEY `leave_requests_status_idx` (`status`),
  ADD KEY `leave_requests_approverId_idx` (`approverId`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_types_name_key` (`name`);

--
-- Indexes for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `performance_reviews_userId_idx` (`userId`),
  ADD KEY `performance_reviews_reviewerId_idx` (`reviewerId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_action_subject_key` (`action`,`subject`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `role_permissions_permissionId_fkey` (`permissionId`);

--
-- Indexes for table `salary_history`
--
ALTER TABLE `salary_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_history_userId_idx` (`userId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sessions_sessionToken_key` (`sessionToken`),
  ADD KEY `sessions_userId_fkey` (`userId`);

--
-- Indexes for table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_managerId_idx` (`managerId`),
  ADD KEY `users_departmentId_idx` (`departmentId`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`userId`,`roleId`),
  ADD KEY `user_roles_roleId_fkey` (`roleId`);

--
-- Indexes for table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  ADD PRIMARY KEY (`identifier`,`token`),
  ADD UNIQUE KEY `verification_tokens_token_key` (`token`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD CONSTRAINT `emergency_contacts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_benefits`
--
ALTER TABLE `employee_benefits`
  ADD CONSTRAINT `employee_benefits_benefitId_fkey` FOREIGN KEY (`benefitId`) REFERENCES `benefits` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employee_benefits_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_contracts`
--
ALTER TABLE `employee_contracts`
  ADD CONSTRAINT `employee_contracts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD CONSTRAINT `employee_documents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD CONSTRAINT `employee_trainings_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `trainings` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employee_trainings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_requests_leaveTypeId_fkey` FOREIGN KEY (`leaveTypeId`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD CONSTRAINT `performance_reviews_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `salary_history`
--
ALTER TABLE `salary_history`
  ADD CONSTRAINT `salary_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
