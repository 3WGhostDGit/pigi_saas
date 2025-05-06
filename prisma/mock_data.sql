-- PIGI Database Mock Data
-- Generated mock data for development and testing purposes

-- Start transaction and disable foreign key checks for initial load
START TRANSACTION;
SET FOREIGN_KEY_CHECKS=0;

-- Clear existing data
DELETE FROM `role_permissions`;
DELETE FROM `user_roles`;
DELETE FROM `employee_documents`;
DELETE FROM `emergency_contacts`;
DELETE FROM `employee_trainings`;
DELETE FROM `trainings`;
DELETE FROM `employee_benefits`;
DELETE FROM `benefits`;
DELETE FROM `performance_reviews`;
DELETE FROM `salary_history`;
DELETE FROM `employee_contracts`;
DELETE FROM `leave_requests`;
DELETE FROM `leave_types`;
DELETE FROM `accounts`;
DELETE FROM `sessions`;
DELETE FROM `verification_tokens`;
DELETE FROM `users`;
DELETE FROM `permissions`;
DELETE FROM `roles`;
DELETE FROM `departments`;

-- Insert Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('role_01', 'Admin', 'System administrator with full access'),
('role_02', 'HR Manager', 'Human resources manager with access to all HR functions'),
('role_03', 'HR Assistant', 'Human resources assistant with limited HR access'),
('role_04', 'Department Manager', 'Manager with access to department-specific functions'),
('role_05', 'Employee', 'Regular employee with basic access'),
('role_06', 'Finance Manager', 'Finance department manager'),
('role_07', 'Finance Analyst', 'Finance department analyst'),
('role_08', 'IT Manager', 'IT department manager'),
('role_09', 'IT Support', 'IT support staff'),
('role_10', 'Executive', 'Executive leadership');

-- Insert Permissions
INSERT INTO `permissions` (`id`, `action`, `subject`, `description`) VALUES
('perm_01', 'create', 'user', 'Create new users'),
('perm_02', 'read', 'user', 'View user information'),
('perm_03', 'update', 'user', 'Update user information'),
('perm_04', 'delete', 'user', 'Delete users'),
('perm_05', 'create', 'department', 'Create new departments'),
('perm_06', 'read', 'department', 'View department information'),
('perm_07', 'update', 'department', 'Update department information'),
('perm_08', 'delete', 'department', 'Delete departments'),
('perm_09', 'create', 'leave_request', 'Create leave requests'),
('perm_10', 'read', 'leave_request', 'View leave requests'),
('perm_11', 'update', 'leave_request', 'Update leave requests'),
('perm_12', 'approve', 'leave_request', 'Approve or reject leave requests'),
('perm_13', 'create', 'contract', 'Create employee contracts'),
('perm_14', 'read', 'contract', 'View employee contracts'),
('perm_15', 'update', 'contract', 'Update employee contracts'),
('perm_16', 'delete', 'contract', 'Delete employee contracts'),
('perm_17', 'create', 'salary', 'Create salary records'),
('perm_18', 'read', 'salary', 'View salary information'),
('perm_19', 'update', 'salary', 'Update salary information'),
('perm_20', 'create', 'performance_review', 'Create performance reviews'),
('perm_21', 'read', 'performance_review', 'View performance reviews'),
('perm_22', 'update', 'performance_review', 'Update performance reviews'),
('perm_23', 'read', 'own_performance_review', 'View own performance reviews'),
('perm_24', 'create', 'benefit', 'Create benefits'),
('perm_25', 'read', 'benefit', 'View benefits'),
('perm_26', 'update', 'benefit', 'Update benefits'),
('perm_27', 'delete', 'benefit', 'Delete benefits'),
('perm_28', 'create', 'training', 'Create training programs'),
('perm_29', 'read', 'training', 'View training programs'),
('perm_30', 'update', 'training', 'Update training programs'),
('perm_31', 'delete', 'training', 'Delete training programs'),
('perm_32', 'create', 'document', 'Upload employee documents'),
('perm_33', 'read', 'document', 'View employee documents'),
('perm_34', 'update', 'document', 'Update employee documents'),
('perm_35', 'delete', 'document', 'Delete employee documents'),
('perm_36', 'read', 'own_document', 'View own documents'),
('perm_37', 'create', 'emergency_contact', 'Create emergency contacts'),
('perm_38', 'read', 'emergency_contact', 'View emergency contacts'),
('perm_39', 'update', 'emergency_contact', 'Update emergency contacts'),
('perm_40', 'delete', 'emergency_contact', 'Delete emergency contacts');

-- Role-Permission Mappings
INSERT INTO `role_permissions` (`roleId`, `permissionId`) VALUES
-- Admin has all permissions
('role_01', 'perm_01'), ('role_01', 'perm_02'), ('role_01', 'perm_03'), ('role_01', 'perm_04'),
('role_01', 'perm_05'), ('role_01', 'perm_06'), ('role_01', 'perm_07'), ('role_01', 'perm_08'),
('role_01', 'perm_09'), ('role_01', 'perm_10'), ('role_01', 'perm_11'), ('role_01', 'perm_12'),
('role_01', 'perm_13'), ('role_01', 'perm_14'), ('role_01', 'perm_15'), ('role_01', 'perm_16'),
('role_01', 'perm_17'), ('role_01', 'perm_18'), ('role_01', 'perm_19'), ('role_01', 'perm_20'),
('role_01', 'perm_21'), ('role_01', 'perm_22'), ('role_01', 'perm_23'), ('role_01', 'perm_24'),
('role_01', 'perm_25'), ('role_01', 'perm_26'), ('role_01', 'perm_27'), ('role_01', 'perm_28'),
('role_01', 'perm_29'), ('role_01', 'perm_30'), ('role_01', 'perm_31'), ('role_01', 'perm_32'),
('role_01', 'perm_33'), ('role_01', 'perm_34'), ('role_01', 'perm_35'), ('role_01', 'perm_36'),
('role_01', 'perm_37'), ('role_01', 'perm_38'), ('role_01', 'perm_39'), ('role_01', 'perm_40'),

-- HR Manager permissions
('role_02', 'perm_01'), ('role_02', 'perm_02'), ('role_02', 'perm_03'),
('role_02', 'perm_06'), ('role_02', 'perm_09'), ('role_02', 'perm_10'),
('role_02', 'perm_11'), ('role_02', 'perm_12'), ('role_02', 'perm_13'),
('role_02', 'perm_14'), ('role_02', 'perm_15'), ('role_02', 'perm_17'),
('role_02', 'perm_18'), ('role_02', 'perm_19'), ('role_02', 'perm_20'),
('role_02', 'perm_21'), ('role_02', 'perm_22'), ('role_02', 'perm_24'),
('role_02', 'perm_25'), ('role_02', 'perm_26'), ('role_02', 'perm_28'),
('role_02', 'perm_29'), ('role_02', 'perm_30'), ('role_02', 'perm_32'),
('role_02', 'perm_33'), ('role_02', 'perm_34'), ('role_02', 'perm_37'),
('role_02', 'perm_38'), ('role_02', 'perm_39'),

-- HR Assistant permissions
('role_03', 'perm_02'), ('role_03', 'perm_06'), ('role_03', 'perm_10'),
('role_03', 'perm_14'), ('role_03', 'perm_18'), ('role_03', 'perm_21'),
('role_03', 'perm_25'), ('role_03', 'perm_29'), ('role_03', 'perm_33'),
('role_03', 'perm_38'),

-- Department Manager permissions
('role_04', 'perm_02'), ('role_04', 'perm_06'), ('role_04', 'perm_09'),
('role_04', 'perm_10'), ('role_04', 'perm_11'), ('role_04', 'perm_12'),
('role_04', 'perm_14'), ('role_04', 'perm_18'), ('role_04', 'perm_20'),
('role_04', 'perm_21'), ('role_04', 'perm_22'), ('role_04', 'perm_23'),
('role_04', 'perm_25'), ('role_04', 'perm_29'), ('role_04', 'perm_33'),
('role_04', 'perm_36'), ('role_04', 'perm_38'),

-- Employee permissions
('role_05', 'perm_09'), ('role_05', 'perm_23'), ('role_05', 'perm_36'),
('role_05', 'perm_37'), ('role_05', 'perm_38'), ('role_05', 'perm_39');

-- Insert Departments
INSERT INTO `departments` (`id`, `name`, `description`, `parentId`) VALUES
('dept_01', 'Executive', 'Executive leadership team', NULL),
('dept_02', 'Human Resources', 'HR department responsible for personnel management', NULL),
('dept_03', 'Finance', 'Finance and accounting department', NULL),
('dept_04', 'Information Technology', 'IT department responsible for technology infrastructure', NULL),
('dept_05', 'Marketing', 'Marketing and communications department', NULL),
('dept_06', 'Sales', 'Sales and business development', NULL),
('dept_07', 'Operations', 'Operations and logistics', NULL),
('dept_08', 'Research & Development', 'R&D department', NULL),
('dept_09', 'Customer Support', 'Customer service and support', 'dept_06'),
('dept_10', 'Legal', 'Legal department', NULL),
('dept_11', 'Product Management', 'Product strategy and management', 'dept_08'),
('dept_12', 'Quality Assurance', 'Quality control and testing', 'dept_08'),
('dept_13', 'Software Development', 'Software engineering team', 'dept_04'),
('dept_14', 'Infrastructure', 'IT infrastructure and operations', 'dept_04'),
('dept_15', 'Data Science', 'Data analytics and machine learning', 'dept_04');

-- Insert Leave Types
INSERT INTO `leave_types` (`id`, `name`, `description`) VALUES
('leave_01', 'Congé Payé', 'Paid vacation leave'),
('leave_02', 'Maladie', 'Sick leave'),
('leave_03', 'RTT', 'Reduction of working time'),
('leave_04', 'Congé Maternité', 'Maternity leave'),
('leave_05', 'Congé Paternité', 'Paternity leave'),
('leave_06', 'Congé sans Solde', 'Unpaid leave'),
('leave_07', 'Congé Formation', 'Training leave'),
('leave_08', 'Congé Familial', 'Family leave'),
('leave_09', 'Télétravail Exceptionnel', 'Exceptional remote work'),
('leave_10', 'Absence Autorisée', 'Authorized absence');

-- Insert Benefits
INSERT INTO `benefits` (`id`, `name`, `description`, `provider`, `costPerMonth`, `employeeContribution`, `companyContribution`, `isActive`) VALUES
('benefit_01', 'Assurance Maladie Complémentaire', 'Supplementary health insurance', 'AXA Assurances', 100.00, 30.00, 70.00, 1),
('benefit_02', 'Tickets Restaurant', 'Meal vouchers', 'Edenred', 180.00, 90.00, 90.00, 1),
('benefit_03', 'Mutuelle Dentaire', 'Dental insurance', 'AXA Assurances', 40.00, 15.00, 25.00, 1),
('benefit_04', 'Assurance Vie', 'Life insurance', 'Allianz', 50.00, 0.00, 50.00, 1),
('benefit_05', 'Plan d\'Épargne Entreprise', 'Company savings plan', 'BNP Paribas', NULL, NULL, NULL, 1),
('benefit_06', 'Abonnement Salle de Sport', 'Gym membership', 'FitnessPark', 45.00, 22.50, 22.50, 1),
('benefit_07', 'Indemnité Transport', 'Transportation allowance', NULL, 75.00, 0.00, 75.00, 1),
('benefit_08', 'Chèques Vacances', 'Holiday vouchers', 'ANCV', 100.00, 50.00, 50.00, 1),
('benefit_09', 'Participation aux Bénéfices', 'Profit sharing', NULL, NULL, NULL, NULL, 1),
('benefit_10', 'Retraite Complémentaire', 'Supplementary pension', 'AG2R', 120.00, 40.00, 80.00, 1);

-- Insert Users
INSERT INTO `users` (`id`, `name`, `email`, `emailVerified`, `image`, `hashedPassword`, `createdAt`, `updatedAt`, `departmentId`, `jobTitle`, `managerId`, `entryDate`) VALUES
-- Admin user
('user_01', 'Admin User', 'admin@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_04', 'System Administrator', NULL, '2023-01-01'),

-- Executive team
('user_02', 'Jean Dupont', 'jean.dupont@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_01', 'CEO', NULL, '2018-01-15'),
('user_03', 'Marie Laurent', 'marie.laurent@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_01', 'CFO', 'user_02', '2018-03-01'),
('user_04', 'Pierre Martin', 'pierre.martin@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_01', 'CTO', 'user_02', '2018-02-15'),

-- HR Department
('user_05', 'Sophie Petit', 'sophie.petit@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_02', 'HR Director', 'user_02', '2018-04-01'),
('user_06', 'Thomas Leroy', 'thomas.leroy@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_02', 'HR Manager', 'user_05', '2019-01-15'),
('user_07', 'Camille Dubois', 'camille.dubois@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_02', 'HR Assistant', 'user_06', '2020-06-01'),

-- Finance Department
('user_08', 'Lucas Moreau', 'lucas.moreau@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_03', 'Finance Manager', 'user_03', '2019-02-01'), -- password: password123
('user_09', 'Emma Lefebvre', 'emma.lefebvre@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_03', 'Senior Accountant', 'user_08', '2019-05-15'),
('user_10', 'Hugo Bernard', 'hugo.bernard@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_03', 'Financial Analyst', 'user_08', '2020-03-01'),

-- IT Department
('user_11', 'Léa Rousseau', 'lea.rousseau@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_04', 'IT Manager', 'user_04', '2019-01-10'),
('user_12', 'Gabriel Fournier', 'gabriel.fournier@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_13', 'Lead Developer', 'user_11', '2019-03-15'),
('user_13', 'Chloé Girard', 'chloe.girard@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_13', 'Frontend Developer', 'user_12', '2020-01-15'),
('user_14', 'Louis Roux', 'louis.roux@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_13', 'Backend Developer', 'user_12', '2020-02-01'),
('user_15', 'Manon Bonnet', 'manon.bonnet@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_14', 'System Administrator', 'user_11', '2019-06-01'),
('user_16', 'Jules Mercier', 'jules.mercier@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_15', 'Data Scientist', 'user_11', '2020-04-15'),

-- Marketing Department
('user_17', 'Alice Lemoine', 'alice.lemoine@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_05', 'Marketing Director', 'user_02', '2018-07-01'),
('user_18', 'Théo Lambert', 'theo.lambert@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_05', 'Marketing Manager', 'user_17', '2019-02-15'),
('user_19', 'Inès Faure', 'ines.faure@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_05', 'Digital Marketing Specialist', 'user_18', '2020-01-15'),
('user_20', 'Nathan Legrand', 'nathan.legrand@example.com', '2023-01-01 00:00:00', NULL, '$2a$10$GmQzTXcl5Ae1esQbV2Lh1.ePVUOw1pYVCKIgIKJX.Uh/8qZrTkJHO', '2023-01-01 00:00:00', '2023-01-01 00:00:00', 'dept_05', 'Content Creator', 'user_18', '2021-03-01');

-- User Role Assignments
INSERT INTO `user_roles` (`userId`, `roleId`) VALUES
-- Admin
('user_01', 'role_01'),

-- Executives
('user_02', 'role_10'), -- CEO
('user_03', 'role_10'), -- CFO
('user_04', 'role_10'), -- CTO

-- HR Department
('user_05', 'role_02'), -- HR Director
('user_06', 'role_02'), -- HR Manager
('user_07', 'role_03'), -- HR Assistant

-- Finance Department
('user_08', 'role_06'), -- Finance Manager
('user_09', 'role_07'), -- Senior Accountant
('user_10', 'role_07'), -- Financial Analyst

-- IT Department
('user_11', 'role_08'), -- IT Manager
('user_12', 'role_04'), -- Lead Developer
('user_13', 'role_05'), -- Frontend Developer
('user_14', 'role_05'), -- Backend Developer
('user_15', 'role_09'), -- System Administrator
('user_16', 'role_05'), -- Data Scientist

-- Marketing Department
('user_17', 'role_04'), -- Marketing Director
('user_18', 'role_04'), -- Marketing Manager
('user_19', 'role_05'), -- Digital Marketing Specialist
('user_20', 'role_05'); -- Content Creator

-- Insert Training Programs
INSERT INTO `trainings` (`id`, `name`, `description`, `provider`, `duration`, `cost`, `startDate`, `endDate`, `isMandatory`) VALUES
('training_01', 'Sécurité au Travail', 'Workplace safety training', 'SafetyFirst', 8, 300.00, '2023-06-15 09:00:00', '2023-06-15 18:00:00', 1),
('training_02', 'Excel Avancé', 'Advanced Excel skills', 'Microsoft Learning', 16, 500.00, '2023-07-10 09:00:00', '2023-07-11 18:00:00', 0),
('training_03', 'Leadership et Management', 'Leadership and management skills', 'Management Institute', 24, 1200.00, '2023-08-21 09:00:00', '2023-08-23 18:00:00', 0),
('training_04', 'RGPD et Protection des Données', 'GDPR and data protection', 'Legal Compliance Ltd', 8, 450.00, '2023-09-05 09:00:00', '2023-09-05 18:00:00', 1),
('training_05', 'Premiers Secours', 'First aid training', 'Red Cross', 16, 250.00, '2023-10-12 09:00:00', '2023-10-13 18:00:00', 1),
('training_06', 'Communication Efficace', 'Effective communication skills', 'Speak Well Institute', 16, 600.00, '2023-11-07 09:00:00', '2023-11-08 18:00:00', 0),
('training_07', 'Développement Web', 'Web development fundamentals', 'CodeAcademy', 40, 1500.00, '2023-12-04 09:00:00', '2023-12-08 18:00:00', 0),
('training_08', 'Gestion de Projet', 'Project management methodology', 'PMI Certified', 24, 900.00, '2024-01-15 09:00:00', '2024-01-17 18:00:00', 0),
('training_09', 'Langues - Anglais Professionnel', 'Business English', 'Berlitz', 30, 1200.00, '2024-02-05 09:00:00', '2024-03-06 18:00:00', 0),
('training_10', 'Cybersécurité', 'Cybersecurity fundamentals', 'SecureNet Training', 16, 800.00, '2024-04-11 09:00:00', '2024-04-12 18:00:00', 1);

-- Insert Salary History
INSERT INTO `salary_history` (`id`, `userId`, `effectiveDate`, `amount`, `currency`, `reason`, `createdAt`) VALUES
-- Executive team
('salary_01', 'user_02', '2018-01-15', 110000.00, 'EUR', 'Initial salary', '2018-01-15 00:00:00'),
('salary_02', 'user_02', '2019-01-15', 115000.00, 'EUR', 'Annual performance review', '2019-01-15 00:00:00'),
('salary_03', 'user_02', '2020-01-15', 120000.00, 'EUR', 'Annual performance review', '2020-01-15 00:00:00'),

('salary_04', 'user_03', '2018-03-01', 90000.00, 'EUR', 'Initial salary', '2018-03-01 00:00:00'),
('salary_05', 'user_03', '2019-03-01', 92500.00, 'EUR', 'Annual performance review', '2019-03-01 00:00:00'),
('salary_06', 'user_03', '2020-03-01', 95000.00, 'EUR', 'Annual performance review', '2020-03-01 00:00:00'),

('salary_07', 'user_04', '2018-02-15', 90000.00, 'EUR', 'Initial salary', '2018-02-15 00:00:00'),
('salary_08', 'user_04', '2019-02-15', 92500.00, 'EUR', 'Annual performance review', '2019-02-15 00:00:00'),
('salary_09', 'user_04', '2020-02-15', 95000.00, 'EUR', 'Annual performance review', '2020-02-15 00:00:00'),

-- HR Department
('salary_10', 'user_05', '2018-04-01', 80000.00, 'EUR', 'Initial salary', '2018-04-01 00:00:00'),
('salary_11', 'user_05', '2019-04-01', 82500.00, 'EUR', 'Annual performance review', '2019-04-01 00:00:00'),
('salary_12', 'user_05', '2020-04-01', 85000.00, 'EUR', 'Annual performance review', '2020-04-01 00:00:00'),

('salary_13', 'user_06', '2019-01-15', 62000.00, 'EUR', 'Initial salary', '2019-01-15 00:00:00'),
('salary_14', 'user_06', '2020-01-15', 65000.00, 'EUR', 'Annual performance review', '2020-01-15 00:00:00'),

('salary_15', 'user_07', '2020-06-01', 42000.00, 'EUR', 'Initial salary', '2020-06-01 00:00:00'),

-- Finance Department
('salary_16', 'user_08', '2019-02-01', 68000.00, 'EUR', 'Initial salary', '2019-02-01 00:00:00'),
('salary_17', 'user_08', '2020-02-01', 70000.00, 'EUR', 'Annual performance review', '2020-02-01 00:00:00'),

('salary_18', 'user_09', '2019-05-15', 52000.00, 'EUR', 'Initial salary', '2019-05-15 00:00:00'),
('salary_19', 'user_09', '2020-05-15', 55000.00, 'EUR', 'Annual performance review', '2020-05-15 00:00:00'),

('salary_20', 'user_10', '2020-03-01', 48000.00, 'EUR', 'Initial salary', '2020-03-01 00:00:00'),

-- IT Department
('salary_21', 'user_11', '2019-01-10', 72000.00, 'EUR', 'Initial salary', '2019-01-10 00:00:00'),
('salary_22', 'user_11', '2020-01-10', 75000.00, 'EUR', 'Annual performance review', '2020-01-10 00:00:00'),

('salary_23', 'user_12', '2019-03-15', 65000.00, 'EUR', 'Initial salary', '2019-03-15 00:00:00'),
('salary_24', 'user_12', '2020-03-15', 68000.00, 'EUR', 'Annual performance review', '2020-03-15 00:00:00'),

('salary_25', 'user_13', '2020-01-15', 52000.00, 'EUR', 'Initial salary', '2020-01-15 00:00:00'),
('salary_26', 'user_14', '2020-02-01', 54000.00, 'EUR', 'Initial salary', '2020-02-01 00:00:00'),

('salary_27', 'user_15', '2019-06-01', 55000.00, 'EUR', 'Initial salary', '2019-06-01 00:00:00'),
('salary_28', 'user_15', '2020-06-01', 58000.00, 'EUR', 'Annual performance review', '2020-06-01 00:00:00'),

('salary_29', 'user_16', '2020-04-15', 62000.00, 'EUR', 'Initial salary', '2020-04-15 00:00:00'),

-- Marketing Department
('salary_30', 'user_17', '2018-07-01', 75000.00, 'EUR', 'Initial salary', '2018-07-01 00:00:00'),
('salary_31', 'user_17', '2019-07-01', 77500.00, 'EUR', 'Annual performance review', '2019-07-01 00:00:00'),
('salary_32', 'user_17', '2020-07-01', 80000.00, 'EUR', 'Annual performance review', '2020-07-01 00:00:00'),

('salary_33', 'user_18', '2019-02-15', 62000.00, 'EUR', 'Initial salary', '2019-02-15 00:00:00'),
('salary_34', 'user_18', '2020-02-15', 65000.00, 'EUR', 'Annual performance review', '2020-02-15 00:00:00'),

('salary_35', 'user_19', '2020-01-15', 48000.00, 'EUR', 'Initial salary', '2020-01-15 00:00:00'),
('salary_36', 'user_20', '2021-03-01', 42000.00, 'EUR', 'Initial salary', '2021-03-01 00:00:00'),
('salary_37', 'user_01', '2023-01-01', 65000.00, 'EUR', 'Initial salary', '2023-01-01 00:00:00');

-- Insert Employee Contracts
INSERT INTO `employee_contracts` (`id`, `userId`, `contractType`, `status`, `startDate`, `endDate`, `jobTitle`, `salary`, `currency`, `workingHours`, `trialPeriodEndDate`, `contractUrl`, `createdAt`, `updatedAt`) VALUES
-- Executive team
('contract_01', 'user_02', 'PERMANENT', 'ACTIVE', '2018-01-15', NULL, 'CEO', 120000.00, 'EUR', 40.0, '2018-04-15', NULL, '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('contract_02', 'user_03', 'PERMANENT', 'ACTIVE', '2018-03-01', NULL, 'CFO', 95000.00, 'EUR', 40.0, '2018-06-01', NULL, '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('contract_03', 'user_04', 'PERMANENT', 'ACTIVE', '2018-02-15', NULL, 'CTO', 95000.00, 'EUR', 40.0, '2018-05-15', NULL, '2018-02-15 00:00:00', '2018-02-15 00:00:00'),

-- HR Department
('contract_04', 'user_05', 'PERMANENT', 'ACTIVE', '2018-04-01', NULL, 'HR Director', 85000.00, 'EUR', 40.0, '2018-07-01', NULL, '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('contract_05', 'user_06', 'PERMANENT', 'ACTIVE', '2019-01-15', NULL, 'HR Manager', 65000.00, 'EUR', 40.0, '2019-04-15', NULL, '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('contract_06', 'user_07', 'PERMANENT', 'ACTIVE', '2020-06-01', NULL, 'HR Assistant', 42000.00, 'EUR', 35.0, '2020-09-01', NULL, '2020-06-01 00:00:00', '2020-06-01 00:00:00'),

-- Finance Department
('contract_07', 'user_08', 'PERMANENT', 'ACTIVE', '2019-02-01', NULL, 'Finance Manager', 70000.00, 'EUR', 40.0, '2019-05-01', NULL, '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('contract_08', 'user_09', 'PERMANENT', 'ACTIVE', '2019-05-15', NULL, 'Senior Accountant', 55000.00, 'EUR', 40.0, '2019-08-15', NULL, '2019-05-15 00:00:00', '2019-05-15 00:00:00'),
('contract_09', 'user_10', 'PERMANENT', 'ACTIVE', '2020-03-01', NULL, 'Financial Analyst', 48000.00, 'EUR', 40.0, '2020-06-01', NULL, '2020-03-01 00:00:00', '2020-03-01 00:00:00'),

-- IT Department
('contract_10', 'user_11', 'PERMANENT', 'ACTIVE', '2019-01-10', NULL, 'IT Manager', 75000.00, 'EUR', 40.0, '2019-04-10', NULL, '2019-01-10 00:00:00', '2019-01-10 00:00:00'),
('contract_11', 'user_12', 'PERMANENT', 'ACTIVE', '2019-03-15', NULL, 'Lead Developer', 68000.00, 'EUR', 40.0, '2019-06-15', NULL, '2019-03-15 00:00:00', '2019-03-15 00:00:00'),
('contract_12', 'user_13', 'PERMANENT', 'ACTIVE', '2020-01-15', NULL, 'Frontend Developer', 52000.00, 'EUR', 40.0, '2020-04-15', NULL, '2020-01-15 00:00:00', '2020-01-15 00:00:00'),
('contract_13', 'user_14', 'PERMANENT', 'ACTIVE', '2020-02-01', NULL, 'Backend Developer', 54000.00, 'EUR', 40.0, '2020-05-01', NULL, '2020-02-01 00:00:00', '2020-02-01 00:00:00'),
('contract_14', 'user_15', 'PERMANENT', 'ACTIVE', '2019-06-01', NULL, 'System Administrator', 58000.00, 'EUR', 40.0, '2019-09-01', NULL, '2019-06-01 00:00:00', '2019-06-01 00:00:00'),
('contract_15', 'user_16', 'PERMANENT', 'ACTIVE', '2020-04-15', NULL, 'Data Scientist', 62000.00, 'EUR', 40.0, '2020-07-15', NULL, '2020-04-15 00:00:00', '2020-04-15 00:00:00'),

-- Marketing Department
('contract_16', 'user_17', 'PERMANENT', 'ACTIVE', '2018-07-01', NULL, 'Marketing Director', 80000.00, 'EUR', 40.0, '2018-10-01', NULL, '2018-07-01 00:00:00', '2018-07-01 00:00:00'),
('contract_17', 'user_18', 'PERMANENT', 'ACTIVE', '2019-02-15', NULL, 'Marketing Manager', 65000.00, 'EUR', 40.0, '2019-05-15', NULL, '2019-02-15 00:00:00', '2019-02-15 00:00:00'),
('contract_18', 'user_19', 'PERMANENT', 'ACTIVE', '2020-01-15', NULL, 'Digital Marketing Specialist', 48000.00, 'EUR', 40.0, '2020-04-15', NULL, '2020-01-15 00:00:00', '2020-01-15 00:00:00'),
('contract_19', 'user_20', 'FIXED_TERM', 'ACTIVE', '2021-03-01', '2023-03-01', 'Content Creator', 42000.00, 'EUR', 35.0, '2021-06-01', NULL, '2021-03-01 00:00:00', '2021-03-01 00:00:00'),
('contract_20', 'user_01', 'PERMANENT', 'ACTIVE', '2023-01-01', NULL, 'System Administrator', 65000.00, 'EUR', 40.0, '2023-04-01', NULL, '2023-01-01 00:00:00', '2023-01-01 00:00:00');

-- Insert Performance Reviews
INSERT INTO `performance_reviews` (`id`, `userId`, `reviewerId`, `reviewDate`, `periodStartDate`, `periodEndDate`, `rating`, `strengths`, `weaknesses`, `goals`, `comments`, `createdAt`, `updatedAt`) VALUES
-- Executive team
('review_01', 'user_03', 'user_02', '2019-03-15', '2018-03-01', '2019-03-01', 'EXCEEDS_EXPECTATIONS', 'Strong financial management, excellent team leadership', 'Could improve on strategic planning', 'Implement new financial reporting system', 'Excellent performance overall', '2019-03-15 00:00:00', '2019-03-15 00:00:00'),
('review_02', 'user_03', 'user_02', '2020-03-15', '2019-03-01', '2020-03-01', 'EXCEEDS_EXPECTATIONS', 'Successfully implemented new financial controls, good cost management', 'Communication with other departments could be improved', 'Develop 5-year financial strategy', 'Continued strong performance', '2020-03-15 00:00:00', '2020-03-15 00:00:00'),

('review_03', 'user_04', 'user_02', '2019-02-28', '2018-02-15', '2019-02-15', 'OUTSTANDING', 'Exceptional technical leadership, successful system migration', 'Documentation could be more thorough', 'Implement cloud migration strategy', 'Outstanding technical vision and execution', '2019-02-28 00:00:00', '2019-02-28 00:00:00'),
('review_04', 'user_04', 'user_02', '2020-02-28', '2019-02-15', '2020-02-15', 'EXCEEDS_EXPECTATIONS', 'Successfully led cloud migration, good team development', 'Project timelines occasionally slip', 'Implement DevOps practices across the organization', 'Strong performance and technical leadership', '2020-02-28 00:00:00', '2020-02-28 00:00:00'),

-- HR Department
('review_05', 'user_05', 'user_02', '2019-04-15', '2018-04-01', '2019-04-01', 'EXCEEDS_EXPECTATIONS', 'Excellent HR policy development, strong recruitment process', 'Employee engagement initiatives could be expanded', 'Implement new HRIS system', 'Very good performance', '2019-04-15 00:00:00', '2019-04-15 00:00:00'),
('review_06', 'user_05', 'user_02', '2020-04-15', '2019-04-01', '2020-04-01', 'EXCEEDS_EXPECTATIONS', 'Successfully implemented HRIS, improved onboarding process', 'Training programs need more structure', 'Develop comprehensive training curriculum', 'Continued strong performance', '2020-04-15 00:00:00', '2020-04-15 00:00:00'),

('review_07', 'user_06', 'user_05', '2020-01-30', '2019-01-15', '2020-01-15', 'MEETS_EXPECTATIONS', 'Good recruitment execution, reliable HR operations', 'Strategic thinking could be improved', 'Take leadership on diversity initiatives', 'Solid performance with room for growth', '2020-01-30 00:00:00', '2020-01-30 00:00:00'),

-- Finance Department
('review_08', 'user_08', 'user_03', '2020-02-15', '2019-02-01', '2020-02-01', 'EXCEEDS_EXPECTATIONS', 'Excellent budget management, strong analytical skills', 'Could delegate more effectively', 'Implement new expense management system', 'Very good performance', '2020-02-15 00:00:00', '2020-02-15 00:00:00'),

('review_09', 'user_09', 'user_08', '2020-05-30', '2019-05-15', '2020-05-15', 'EXCEEDS_EXPECTATIONS', 'Accurate financial reporting, good process improvements', 'Could be more proactive in identifying issues', 'Get additional certification', 'Strong performance', '2020-05-30 00:00:00', '2020-05-30 00:00:00'),

-- IT Department
('review_10', 'user_11', 'user_04', '2020-01-20', '2019-01-10', '2020-01-10', 'EXCEEDS_EXPECTATIONS', 'Strong technical leadership, good project management', 'Documentation needs improvement', 'Implement IT governance framework', 'Very good performance', '2020-01-20 00:00:00', '2020-01-20 00:00:00'),

('review_11', 'user_12', 'user_11', '2020-03-30', '2019-03-15', '2020-03-15', 'OUTSTANDING', 'Exceptional code quality, excellent team leadership', 'Could improve on estimating project timelines', 'Implement CI/CD pipeline', 'Outstanding performance', '2020-03-30 00:00:00', '2020-03-30 00:00:00'),

('review_12', 'user_15', 'user_11', '2020-06-15', '2019-06-01', '2020-06-01', 'MEETS_EXPECTATIONS', 'Reliable system maintenance, good problem solving', 'Documentation and knowledge sharing need improvement', 'Implement automated monitoring system', 'Solid performance with areas for improvement', '2020-06-15 00:00:00', '2020-06-15 00:00:00'),

-- Marketing Department
('review_13', 'user_17', 'user_02', '2019-07-15', '2018-07-01', '2019-07-01', 'EXCEEDS_EXPECTATIONS', 'Strong brand development, excellent campaign execution', 'Digital strategy could be more comprehensive', 'Develop integrated marketing plan', 'Very good performance', '2019-07-15 00:00:00', '2019-07-15 00:00:00'),
('review_14', 'user_17', 'user_02', '2020-07-15', '2019-07-01', '2020-07-01', 'EXCEEDS_EXPECTATIONS', 'Successfully increased brand awareness, good team development', 'ROI measurement could be improved', 'Implement marketing automation', 'Continued strong performance', '2020-07-15 00:00:00', '2020-07-15 00:00:00'),

('review_15', 'user_18', 'user_17', '2020-02-28', '2019-02-15', '2020-02-15', 'EXCEEDS_EXPECTATIONS', 'Excellent campaign management, strong creative direction', 'Budget management could be improved', 'Develop comprehensive content strategy', 'Very good performance', '2020-02-28 00:00:00', '2020-02-28 00:00:00');

-- Insert Employee Benefits
INSERT INTO `employee_benefits` (`id`, `userId`, `benefitId`, `startDate`, `endDate`, `notes`, `createdAt`, `updatedAt`) VALUES
-- Executive team
('emp_benefit_01', 'user_02', 'benefit_01', '2018-01-15', NULL, 'Executive health plan', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('emp_benefit_02', 'user_02', 'benefit_04', '2018-01-15', NULL, 'Executive life insurance', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('emp_benefit_03', 'user_02', 'benefit_05', '2018-01-15', NULL, 'Executive savings plan', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('emp_benefit_04', 'user_02', 'benefit_09', '2018-01-15', NULL, 'Executive profit sharing', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('emp_benefit_05', 'user_02', 'benefit_10', '2018-01-15', NULL, 'Executive pension plan', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),

('emp_benefit_06', 'user_03', 'benefit_01', '2018-03-01', NULL, 'Executive health plan', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('emp_benefit_07', 'user_03', 'benefit_04', '2018-03-01', NULL, 'Executive life insurance', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('emp_benefit_08', 'user_03', 'benefit_05', '2018-03-01', NULL, 'Executive savings plan', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('emp_benefit_09', 'user_03', 'benefit_09', '2018-03-01', NULL, 'Executive profit sharing', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('emp_benefit_10', 'user_03', 'benefit_10', '2018-03-01', NULL, 'Executive pension plan', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),

('emp_benefit_11', 'user_04', 'benefit_01', '2018-02-15', NULL, 'Executive health plan', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('emp_benefit_12', 'user_04', 'benefit_04', '2018-02-15', NULL, 'Executive life insurance', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('emp_benefit_13', 'user_04', 'benefit_05', '2018-02-15', NULL, 'Executive savings plan', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('emp_benefit_14', 'user_04', 'benefit_09', '2018-02-15', NULL, 'Executive profit sharing', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('emp_benefit_15', 'user_04', 'benefit_10', '2018-02-15', NULL, 'Executive pension plan', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),

-- HR Department
('emp_benefit_16', 'user_05', 'benefit_01', '2018-04-01', NULL, 'Management health plan', '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('emp_benefit_17', 'user_05', 'benefit_02', '2018-04-01', NULL, 'Standard meal vouchers', '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('emp_benefit_18', 'user_05', 'benefit_05', '2018-04-01', NULL, 'Management savings plan', '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('emp_benefit_19', 'user_05', 'benefit_10', '2018-04-01', NULL, 'Management pension plan', '2018-04-01 00:00:00', '2018-04-01 00:00:00'),

('emp_benefit_20', 'user_06', 'benefit_01', '2019-01-15', NULL, 'Management health plan', '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('emp_benefit_21', 'user_06', 'benefit_02', '2019-01-15', NULL, 'Standard meal vouchers', '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('emp_benefit_22', 'user_06', 'benefit_05', '2019-01-15', NULL, 'Management savings plan', '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('emp_benefit_23', 'user_06', 'benefit_10', '2019-01-15', NULL, 'Management pension plan', '2019-01-15 00:00:00', '2019-01-15 00:00:00'),

('emp_benefit_24', 'user_07', 'benefit_01', '2020-06-01', NULL, 'Standard health plan', '2020-06-01 00:00:00', '2020-06-01 00:00:00'),
('emp_benefit_25', 'user_07', 'benefit_02', '2020-06-01', NULL, 'Standard meal vouchers', '2020-06-01 00:00:00', '2020-06-01 00:00:00'),
('emp_benefit_26', 'user_07', 'benefit_07', '2020-06-01', NULL, 'Public transport pass', '2020-06-01 00:00:00', '2020-06-01 00:00:00'),
('emp_benefit_27', 'user_07', 'benefit_10', '2020-06-01', NULL, 'Standard pension plan', '2020-06-01 00:00:00', '2020-06-01 00:00:00'),

-- Finance Department
('emp_benefit_28', 'user_08', 'benefit_01', '2019-02-01', NULL, 'Management health plan', '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('emp_benefit_29', 'user_08', 'benefit_02', '2019-02-01', NULL, 'Standard meal vouchers', '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('emp_benefit_30', 'user_08', 'benefit_05', '2019-02-01', NULL, 'Management savings plan', '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('emp_benefit_31', 'user_08', 'benefit_10', '2019-02-01', NULL, 'Management pension plan', '2019-02-01 00:00:00', '2019-02-01 00:00:00'),

('emp_benefit_32', 'user_09', 'benefit_01', '2019-05-15', NULL, 'Standard health plan', '2019-05-15 00:00:00', '2019-05-15 00:00:00'),
('emp_benefit_33', 'user_09', 'benefit_02', '2019-05-15', NULL, 'Standard meal vouchers', '2019-05-15 00:00:00', '2019-05-15 00:00:00'),
('emp_benefit_34', 'user_09', 'benefit_07', '2019-05-15', NULL, 'Public transport pass', '2019-05-15 00:00:00', '2019-05-15 00:00:00'),
('emp_benefit_35', 'user_09', 'benefit_10', '2019-05-15', NULL, 'Standard pension plan', '2019-05-15 00:00:00', '2019-05-15 00:00:00'),

('emp_benefit_36', 'user_10', 'benefit_01', '2020-03-01', NULL, 'Standard health plan', '2020-03-01 00:00:00', '2020-03-01 00:00:00'),
('emp_benefit_37', 'user_10', 'benefit_02', '2020-03-01', NULL, 'Standard meal vouchers', '2020-03-01 00:00:00', '2020-03-01 00:00:00'),
('emp_benefit_38', 'user_10', 'benefit_07', '2020-03-01', NULL, 'Public transport pass', '2020-03-01 00:00:00', '2020-03-01 00:00:00'),
('emp_benefit_39', 'user_10', 'benefit_10', '2020-03-01', NULL, 'Standard pension plan', '2020-03-01 00:00:00', '2020-03-01 00:00:00');

-- Insert Employee Trainings
INSERT INTO `employee_trainings` (`id`, `userId`, `trainingId`, `status`, `completionDate`, `score`, `certificateUrl`, `createdAt`, `updatedAt`) VALUES
-- Mandatory trainings for all employees
('emp_training_01', 'user_02', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 95, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_02', 'user_03', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 90, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_03', 'user_04', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 92, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_04', 'user_05', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 88, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_05', 'user_06', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 85, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_06', 'user_07', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 82, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_07', 'user_08', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 91, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_08', 'user_09', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 87, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_09', 'user_10', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 84, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_10', 'user_11', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 93, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_11', 'user_12', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 90, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_12', 'user_13', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 86, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_13', 'user_14', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 89, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_14', 'user_15', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 83, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_15', 'user_16', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 94, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_16', 'user_17', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 88, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_17', 'user_18', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 85, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_18', 'user_19', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 81, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_19', 'user_20', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 79, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),
('emp_training_20', 'user_01', 'training_01', 'COMPLETED', '2023-06-15 18:00:00', 96, NULL, '2023-06-15 00:00:00', '2023-06-15 18:00:00'),

-- GDPR training for all employees
('emp_training_21', 'user_02', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 92, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_22', 'user_03', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 88, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_23', 'user_04', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 95, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_24', 'user_05', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 90, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_25', 'user_06', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 87, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_26', 'user_07', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 85, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_27', 'user_08', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 89, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_28', 'user_09', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 86, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_29', 'user_10', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 83, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_30', 'user_11', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 94, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_31', 'user_12', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 91, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_32', 'user_13', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 88, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_33', 'user_14', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 90, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_34', 'user_15', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 85, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_35', 'user_16', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 93, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_36', 'user_17', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 89, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_37', 'user_18', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 86, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_38', 'user_19', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 82, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_39', 'user_20', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 80, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),
('emp_training_40', 'user_01', 'training_04', 'COMPLETED', '2023-09-05 18:00:00', 95, NULL, '2023-09-05 00:00:00', '2023-09-05 18:00:00'),

-- First aid training for selected employees
('emp_training_41', 'user_05', 'training_05', 'COMPLETED', '2023-10-13 18:00:00', 92, NULL, '2023-10-12 00:00:00', '2023-10-13 18:00:00'),
('emp_training_42', 'user_06', 'training_05', 'COMPLETED', '2023-10-13 18:00:00', 88, NULL, '2023-10-12 00:00:00', '2023-10-13 18:00:00'),
('emp_training_43', 'user_11', 'training_05', 'COMPLETED', '2023-10-13 18:00:00', 90, NULL, '2023-10-12 00:00:00', '2023-10-13 18:00:00'),
('emp_training_44', 'user_15', 'training_05', 'COMPLETED', '2023-10-13 18:00:00', 85, NULL, '2023-10-12 00:00:00', '2023-10-13 18:00:00'),
('emp_training_45', 'user_17', 'training_05', 'COMPLETED', '2023-10-13 18:00:00', 89, NULL, '2023-10-12 00:00:00', '2023-10-13 18:00:00'),

-- Specialized trainings for specific departments
-- Excel for Finance
('emp_training_46', 'user_08', 'training_02', 'COMPLETED', '2023-07-11 18:00:00', 94, NULL, '2023-07-10 00:00:00', '2023-07-11 18:00:00'),
('emp_training_47', 'user_09', 'training_02', 'COMPLETED', '2023-07-11 18:00:00', 92, NULL, '2023-07-10 00:00:00', '2023-07-11 18:00:00'),
('emp_training_48', 'user_10', 'training_02', 'COMPLETED', '2023-07-11 18:00:00', 90, NULL, '2023-07-10 00:00:00', '2023-07-11 18:00:00'),

-- Leadership for managers
('emp_training_49', 'user_02', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 95, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_50', 'user_03', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 92, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_51', 'user_04', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 94, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_52', 'user_05', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 90, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_53', 'user_08', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 88, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_54', 'user_11', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 91, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_55', 'user_17', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 89, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),
('emp_training_56', 'user_18', 'training_03', 'COMPLETED', '2023-08-23 18:00:00', 87, NULL, '2023-08-21 00:00:00', '2023-08-23 18:00:00'),

-- Web development for IT
('emp_training_57', 'user_12', 'training_07', 'COMPLETED', '2023-12-08 18:00:00', 96, NULL, '2023-12-04 00:00:00', '2023-12-08 18:00:00'),
('emp_training_58', 'user_13', 'training_07', 'COMPLETED', '2023-12-08 18:00:00', 95, NULL, '2023-12-04 00:00:00', '2023-12-08 18:00:00'),
('emp_training_59', 'user_14', 'training_07', 'COMPLETED', '2023-12-08 18:00:00', 94, NULL, '2023-12-04 00:00:00', '2023-12-08 18:00:00'),

-- Cybersecurity for IT
('emp_training_60', 'user_11', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 93, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_61', 'user_12', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 92, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_62', 'user_13', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 90, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_63', 'user_14', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 91, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_64', 'user_15', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 95, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_65', 'user_16', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 94, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00'),
('emp_training_66', 'user_01', 'training_10', 'COMPLETED', '2024-04-12 18:00:00', 96, NULL, '2024-04-11 00:00:00', '2024-04-12 18:00:00');

-- Insert Emergency Contacts
INSERT INTO `emergency_contacts` (`id`, `userId`, `name`, `relationship`, `phone`, `email`, `address`, `isPrimary`, `createdAt`, `updatedAt`) VALUES
-- Executive team
('emergency_01', 'user_02', 'Marie Dupont', 'Spouse', '+33612345678', 'marie.dupont@email.com', '123 Rue de Paris, 75001 Paris', 1, '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('emergency_02', 'user_03', 'Thomas Laurent', 'Spouse', '+33623456789', 'thomas.laurent@email.com', '456 Avenue Victor Hugo, 75016 Paris', 1, '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('emergency_03', 'user_04', 'Sophie Martin', 'Spouse', '+33634567890', 'sophie.martin@email.com', '789 Boulevard Haussmann, 75008 Paris', 1, '2018-02-15 00:00:00', '2018-02-15 00:00:00'),

-- HR Department
('emergency_04', 'user_05', 'Lucas Petit', 'Spouse', '+33645678901', 'lucas.petit@email.com', '12 Rue de Rivoli, 75004 Paris', 1, '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('emergency_05', 'user_06', 'Emma Leroy', 'Spouse', '+33656789012', 'emma.leroy@email.com', '34 Rue Saint-Honoré, 75001 Paris', 1, '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('emergency_06', 'user_07', 'Hugo Dubois', 'Partner', '+33667890123', 'hugo.dubois@email.com', '56 Rue de la Paix, 75002 Paris', 1, '2020-06-01 00:00:00', '2020-06-01 00:00:00'),

-- Finance Department
('emergency_07', 'user_08', 'Chloé Moreau', 'Spouse', '+33678901234', 'chloe.moreau@email.com', '78 Avenue Montaigne, 75008 Paris', 1, '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('emergency_08', 'user_09', 'Louis Lefebvre', 'Spouse', '+33689012345', 'louis.lefebvre@email.com', '90 Rue du Faubourg Saint-Honoré, 75008 Paris', 1, '2019-05-15 00:00:00', '2019-05-15 00:00:00'),
('emergency_09', 'user_10', 'Léa Bernard', 'Partner', '+33690123456', 'lea.bernard@email.com', '12 Avenue des Champs-Élysées, 75008 Paris', 1, '2020-03-01 00:00:00', '2020-03-01 00:00:00'),

-- IT Department
('emergency_10', 'user_11', 'Gabriel Rousseau', 'Spouse', '+33601234567', 'gabriel.rousseau@email.com', '34 Rue de Vaugirard, 75015 Paris', 1, '2019-01-10 00:00:00', '2019-01-10 00:00:00'),
('emergency_11', 'user_12', 'Manon Fournier', 'Spouse', '+33612345678', 'manon.fournier@email.com', '56 Boulevard Saint-Germain, 75005 Paris', 1, '2019-03-15 00:00:00', '2019-03-15 00:00:00'),
('emergency_12', 'user_13', 'Jules Girard', 'Partner', '+33623456789', 'jules.girard@email.com', '78 Rue de Rennes, 75006 Paris', 1, '2020-01-15 00:00:00', '2020-01-15 00:00:00'),
('emergency_13', 'user_14', 'Camille Roux', 'Spouse', '+33634567890', 'camille.roux@email.com', '90 Rue de Sèvres, 75007 Paris', 1, '2020-02-01 00:00:00', '2020-02-01 00:00:00'),
('emergency_14', 'user_15', 'Théo Bonnet', 'Partner', '+33645678901', 'theo.bonnet@email.com', '12 Rue du Bac, 75007 Paris', 1, '2019-06-01 00:00:00', '2019-06-01 00:00:00'),
('emergency_15', 'user_16', 'Inès Mercier', 'Spouse', '+33656789012', 'ines.mercier@email.com', '34 Rue de Babylone, 75007 Paris', 1, '2020-04-15 00:00:00', '2020-04-15 00:00:00'),

-- Marketing Department
('emergency_16', 'user_17', 'Nathan Lemoine', 'Spouse', '+33667890123', 'nathan.lemoine@email.com', '56 Avenue de Breteuil, 75007 Paris', 1, '2018-07-01 00:00:00', '2018-07-01 00:00:00'),
('emergency_17', 'user_18', 'Chloé Lambert', 'Partner', '+33678901234', 'chloe.lambert@email.com', '78 Rue de Grenelle, 75007 Paris', 1, '2019-02-15 00:00:00', '2019-02-15 00:00:00'),
('emergency_18', 'user_19', 'Lucas Faure', 'Spouse', '+33689012345', 'lucas.faure@email.com', '90 Boulevard Raspail, 75006 Paris', 1, '2020-01-15 00:00:00', '2020-01-15 00:00:00'),
('emergency_19', 'user_20', 'Emma Legrand', 'Partner', '+33690123456', 'emma.legrand@email.com', '12 Rue d\'Assas, 75006 Paris', 1, '2021-03-01 00:00:00', '2021-03-01 00:00:00'),
('emergency_20', 'user_01', 'John Doe', 'Partner', '+33601234567', 'john.doe@email.com', '34 Rue Notre-Dame des Champs, 75006 Paris', 1, '2023-01-01 00:00:00', '2023-01-01 00:00:00');

-- Insert Employee Documents
INSERT INTO `employee_documents` (`id`, `userId`, `documentType`, `fileName`, `fileUrl`, `description`, `issueDate`, `expiryDate`, `uploadedAt`, `updatedAt`) VALUES
-- Executive team
('doc_01', 'user_02', 'CONTRACT', 'contrat_travail_dupont.pdf', 'https://example.com/documents/user_02/contract.pdf', 'Contrat de Travail', '2018-01-15', NULL, '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('doc_02', 'user_02', 'ID_CARD', 'carte_identite_dupont.pdf', 'https://example.com/documents/user_02/id_card.pdf', 'Carte d\'Identité', '2018-01-15', '2028-01-15', '2018-01-15 00:00:00', '2018-01-15 00:00:00'),
('doc_03', 'user_02', 'CERTIFICATE', 'diplome_dupont.pdf', 'https://example.com/documents/user_02/diploma.pdf', 'Diplôme d\'études supérieures', '2010-06-30', NULL, '2018-01-15 00:00:00', '2018-01-15 00:00:00'),

('doc_04', 'user_03', 'CONTRACT', 'contrat_travail_laurent.pdf', 'https://example.com/documents/user_03/contract.pdf', 'Contrat de Travail', '2018-03-01', NULL, '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('doc_05', 'user_03', 'ID_CARD', 'carte_identite_laurent.pdf', 'https://example.com/documents/user_03/id_card.pdf', 'Carte d\'Identité', '2017-05-10', '2027-05-10', '2018-03-01 00:00:00', '2018-03-01 00:00:00'),
('doc_06', 'user_03', 'CERTIFICATE', 'diplome_laurent.pdf', 'https://example.com/documents/user_03/diploma.pdf', 'Diplôme d\'études supérieures', '2009-06-15', NULL, '2018-03-01 00:00:00', '2018-03-01 00:00:00'),

('doc_07', 'user_04', 'CONTRACT', 'contrat_travail_martin.pdf', 'https://example.com/documents/user_04/contract.pdf', 'Contrat de Travail', '2018-02-15', NULL, '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('doc_08', 'user_04', 'ID_CARD', 'carte_identite_martin.pdf', 'https://example.com/documents/user_04/id_card.pdf', 'Carte d\'Identité', '2016-08-22', '2026-08-22', '2018-02-15 00:00:00', '2018-02-15 00:00:00'),
('doc_09', 'user_04', 'CERTIFICATE', 'diplome_martin.pdf', 'https://example.com/documents/user_04/diploma.pdf', 'Diplôme d\'études supérieures', '2008-07-01', NULL, '2018-02-15 00:00:00', '2018-02-15 00:00:00'),

-- HR Department
('doc_10', 'user_05', 'CONTRACT', 'contrat_travail_petit.pdf', 'https://example.com/documents/user_05/contract.pdf', 'Contrat de Travail', '2018-04-01', NULL, '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('doc_11', 'user_05', 'ID_CARD', 'carte_identite_petit.pdf', 'https://example.com/documents/user_05/id_card.pdf', 'Carte d\'Identité', '2015-11-30', '2025-11-30', '2018-04-01 00:00:00', '2018-04-01 00:00:00'),
('doc_12', 'user_05', 'CERTIFICATE', 'diplome_petit.pdf', 'https://example.com/documents/user_05/diploma.pdf', 'Diplôme d\'études supérieures', '2010-06-30', NULL, '2018-04-01 00:00:00', '2018-04-01 00:00:00'),

('doc_13', 'user_06', 'CONTRACT', 'contrat_travail_leroy.pdf', 'https://example.com/documents/user_06/contract.pdf', 'Contrat de Travail', '2019-01-15', NULL, '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('doc_14', 'user_06', 'ID_CARD', 'carte_identite_leroy.pdf', 'https://example.com/documents/user_06/id_card.pdf', 'Carte d\'Identité', '2019-03-18', '2029-03-18', '2019-01-15 00:00:00', '2019-01-15 00:00:00'),
('doc_15', 'user_06', 'CERTIFICATE', 'diplome_leroy.pdf', 'https://example.com/documents/user_06/diploma.pdf', 'Diplôme d\'études supérieures', '2012-06-30', NULL, '2019-01-15 00:00:00', '2019-01-15 00:00:00'),

('doc_16', 'user_07', 'CONTRACT', 'contrat_travail_dubois.pdf', 'https://example.com/documents/user_07/contract.pdf', 'Contrat de Travail', '2020-06-01', NULL, '2020-06-01 00:00:00', '2020-06-01 00:00:00'),
('doc_17', 'user_07', 'ID_CARD', 'carte_identite_dubois.pdf', 'https://example.com/documents/user_07/id_card.pdf', 'Carte d\'Identité', '2020-07-25', '2030-07-25', '2020-06-01 00:00:00', '2020-06-01 00:00:00'),
('doc_18', 'user_07', 'CERTIFICATE', 'diplome_dubois.pdf', 'https://example.com/documents/user_07/diploma.pdf', 'Diplôme d\'études supérieures', '2018-06-30', NULL, '2020-06-01 00:00:00', '2020-06-01 00:00:00'),

-- Finance Department
('doc_19', 'user_08', 'CONTRACT', 'contrat_travail_moreau.pdf', 'https://example.com/documents/user_08/contract.pdf', 'Contrat de Travail', '2019-02-01', NULL, '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('doc_20', 'user_08', 'ID_CARD', 'carte_identite_moreau.pdf', 'https://example.com/documents/user_08/id_card.pdf', 'Carte d\'Identité', '2018-09-14', '2028-09-14', '2019-02-01 00:00:00', '2019-02-01 00:00:00'),
('doc_21', 'user_08', 'CERTIFICATE', 'diplome_moreau.pdf', 'https://example.com/documents/user_08/diploma.pdf', 'Diplôme d\'études supérieures', '2011-06-30', NULL, '2019-02-01 00:00:00', '2019-02-01 00:00:00'),

-- IT Department
('doc_22', 'user_11', 'CONTRACT', 'contrat_travail_rousseau.pdf', 'https://example.com/documents/user_11/contract.pdf', 'Contrat de Travail', '2019-01-10', NULL, '2019-01-10 00:00:00', '2019-01-10 00:00:00'),
('doc_23', 'user_11', 'ID_CARD', 'carte_identite_rousseau.pdf', 'https://example.com/documents/user_11/id_card.pdf', 'Carte d\'Identité', '2017-12-05', '2027-12-05', '2019-01-10 00:00:00', '2019-01-10 00:00:00'),
('doc_24', 'user_11', 'CERTIFICATE', 'diplome_rousseau.pdf', 'https://example.com/documents/user_11/diploma.pdf', 'Diplôme d\'études supérieures', '2010-06-30', NULL, '2019-01-10 00:00:00', '2019-01-10 00:00:00'),
('doc_25', 'user_11', 'CERTIFICATE', 'certification_rousseau.pdf', 'https://example.com/documents/user_11/certification.pdf', 'Certification professionnelle', '2019-01-10', '2024-01-10', '2019-01-10 00:00:00', '2019-01-10 00:00:00'),

-- Marketing Department
('doc_26', 'user_17', 'CONTRACT', 'contrat_travail_lemoine.pdf', 'https://example.com/documents/user_17/contract.pdf', 'Contrat de Travail', '2018-07-01', NULL, '2018-07-01 00:00:00', '2018-07-01 00:00:00'),
('doc_27', 'user_17', 'ID_CARD', 'carte_identite_lemoine.pdf', 'https://example.com/documents/user_17/id_card.pdf', 'Carte d\'Identité', '2016-04-20', '2026-04-20', '2018-07-01 00:00:00', '2018-07-01 00:00:00'),
('doc_28', 'user_17', 'CERTIFICATE', 'diplome_lemoine.pdf', 'https://example.com/documents/user_17/diploma.pdf', 'Diplôme d\'études supérieures', '2009-06-30', NULL, '2018-07-01 00:00:00', '2018-07-01 00:00:00'),

-- Admin
('doc_29', 'user_01', 'CONTRACT', 'contrat_travail_admin.pdf', 'https://example.com/documents/user_01/contract.pdf', 'Contrat de Travail', '2023-01-01', NULL, '2023-01-01 00:00:00', '2023-01-01 00:00:00'),
('doc_30', 'user_01', 'ID_CARD', 'carte_identite_admin.pdf', 'https://example.com/documents/user_01/id_card.pdf', 'Carte d\'Identité', '2023-01-01', '2033-01-01', '2023-01-01 00:00:00', '2023-01-01 00:00:00');

-- Insert Leave Requests
INSERT INTO `leave_requests` (`id`, `userId`, `leaveTypeId`, `startDate`, `endDate`, `reason`, `status`, `approverId`, `approvedAt`, `createdAt`, `updatedAt`) VALUES
-- Executive team
('leave_req_01', 'user_02', 'leave_01', '2023-07-24', '2023-08-04', 'Congés d\'été', 'APPROVED', 'user_02', '2023-06-15 00:00:00', '2023-06-01 00:00:00', '2023-06-15 00:00:00'),
('leave_req_02', 'user_03', 'leave_01', '2023-08-07', '2023-08-18', 'Congés d\'été', 'APPROVED', 'user_02', '2023-06-20 00:00:00', '2023-06-05 00:00:00', '2023-06-20 00:00:00'),
('leave_req_03', 'user_04', 'leave_01', '2023-08-21', '2023-09-01', 'Congés d\'été', 'APPROVED', 'user_02', '2023-06-25 00:00:00', '2023-06-10 00:00:00', '2023-06-25 00:00:00'),

-- HR Department
('leave_req_04', 'user_05', 'leave_01', '2023-07-17', '2023-07-28', 'Congés d\'été', 'APPROVED', 'user_02', '2023-06-01 00:00:00', '2023-05-15 00:00:00', '2023-06-01 00:00:00'),
('leave_req_05', 'user_06', 'leave_01', '2023-07-31', '2023-08-11', 'Congés d\'été', 'APPROVED', 'user_05', '2023-06-05 00:00:00', '2023-05-20 00:00:00', '2023-06-05 00:00:00'),
('leave_req_06', 'user_07', 'leave_01', '2023-08-14', '2023-08-25', 'Congés d\'été', 'APPROVED', 'user_06', '2023-06-10 00:00:00', '2023-05-25 00:00:00', '2023-06-10 00:00:00'),

-- Finance Department
('leave_req_07', 'user_08', 'leave_01', '2023-07-10', '2023-07-21', 'Congés d\'été', 'APPROVED', 'user_03', '2023-05-25 00:00:00', '2023-05-10 00:00:00', '2023-05-25 00:00:00'),
('leave_req_08', 'user_09', 'leave_01', '2023-07-24', '2023-08-04', 'Congés d\'été', 'APPROVED', 'user_08', '2023-05-30 00:00:00', '2023-05-15 00:00:00', '2023-05-30 00:00:00'),
('leave_req_09', 'user_10', 'leave_01', '2023-08-07', '2023-08-18', 'Congés d\'été', 'APPROVED', 'user_08', '2023-06-05 00:00:00', '2023-05-20 00:00:00', '2023-06-05 00:00:00'),

-- IT Department
('leave_req_10', 'user_11', 'leave_01', '2023-07-03', '2023-07-14', 'Congés d\'été', 'APPROVED', 'user_04', '2023-05-20 00:00:00', '2023-05-05 00:00:00', '2023-05-20 00:00:00'),
('leave_req_11', 'user_12', 'leave_01', '2023-07-17', '2023-07-28', 'Congés d\'été', 'APPROVED', 'user_11', '2023-05-25 00:00:00', '2023-05-10 00:00:00', '2023-05-25 00:00:00'),
('leave_req_12', 'user_13', 'leave_01', '2023-07-31', '2023-08-11', 'Congés d\'été', 'APPROVED', 'user_12', '2023-05-30 00:00:00', '2023-05-15 00:00:00', '2023-05-30 00:00:00'),
('leave_req_13', 'user_14', 'leave_01', '2023-08-14', '2023-08-25', 'Congés d\'été', 'APPROVED', 'user_12', '2023-06-05 00:00:00', '2023-05-20 00:00:00', '2023-06-05 00:00:00'),
('leave_req_14', 'user_15', 'leave_01', '2023-08-28', '2023-09-08', 'Congés d\'été', 'APPROVED', 'user_11', '2023-06-10 00:00:00', '2023-05-25 00:00:00', '2023-06-10 00:00:00'),
('leave_req_15', 'user_16', 'leave_01', '2023-09-11', '2023-09-22', 'Congés d\'été', 'APPROVED', 'user_11', '2023-06-15 00:00:00', '2023-05-30 00:00:00', '2023-06-15 00:00:00'),

-- Marketing Department
('leave_req_16', 'user_17', 'leave_01', '2023-07-10', '2023-07-21', 'Congés d\'été', 'APPROVED', 'user_02', '2023-05-25 00:00:00', '2023-05-10 00:00:00', '2023-05-25 00:00:00'),
('leave_req_17', 'user_18', 'leave_01', '2023-07-24', '2023-08-04', 'Congés d\'été', 'APPROVED', 'user_17', '2023-05-30 00:00:00', '2023-05-15 00:00:00', '2023-05-30 00:00:00'),
('leave_req_18', 'user_19', 'leave_01', '2023-08-07', '2023-08-18', 'Congés d\'été', 'APPROVED', 'user_18', '2023-06-05 00:00:00', '2023-05-20 00:00:00', '2023-06-05 00:00:00'),
('leave_req_19', 'user_20', 'leave_01', '2023-08-21', '2023-09-01', 'Congés d\'été', 'APPROVED', 'user_18', '2023-06-10 00:00:00', '2023-05-25 00:00:00', '2023-06-10 00:00:00'),

-- Sick leave examples
('leave_req_20', 'user_07', 'leave_02', '2023-03-13', '2023-03-15', 'Maladie', 'APPROVED', 'user_06', '2023-03-13 00:00:00', '2023-03-13 00:00:00', '2023-03-13 00:00:00'),
('leave_req_21', 'user_10', 'leave_02', '2023-04-24', '2023-04-26', 'Maladie', 'APPROVED', 'user_08', '2023-04-24 00:00:00', '2023-04-24 00:00:00', '2023-04-24 00:00:00'),
('leave_req_22', 'user_13', 'leave_02', '2023-05-08', '2023-05-10', 'Maladie', 'APPROVED', 'user_12', '2023-05-08 00:00:00', '2023-05-08 00:00:00', '2023-05-08 00:00:00'),
('leave_req_23', 'user_19', 'leave_02', '2023-06-19', '2023-06-21', 'Maladie', 'APPROVED', 'user_18', '2023-06-19 00:00:00', '2023-06-19 00:00:00', '2023-06-19 00:00:00'),

-- RTT examples
('leave_req_24', 'user_03', 'leave_03', '2023-05-26', '2023-05-26', 'RTT', 'APPROVED', 'user_02', '2023-05-15 00:00:00', '2023-05-10 00:00:00', '2023-05-15 00:00:00'),
('leave_req_25', 'user_06', 'leave_03', '2023-05-26', '2023-05-26', 'RTT', 'APPROVED', 'user_05', '2023-05-15 00:00:00', '2023-05-10 00:00:00', '2023-05-15 00:00:00'),
('leave_req_26', 'user_09', 'leave_03', '2023-05-26', '2023-05-26', 'RTT', 'APPROVED', 'user_08', '2023-05-15 00:00:00', '2023-05-10 00:00:00', '2023-05-15 00:00:00'),
('leave_req_27', 'user_12', 'leave_03', '2023-05-26', '2023-05-26', 'RTT', 'APPROVED', 'user_11', '2023-05-15 00:00:00', '2023-05-10 00:00:00', '2023-05-15 00:00:00'),
('leave_req_28', 'user_18', 'leave_03', '2023-05-26', '2023-05-26', 'RTT', 'APPROVED', 'user_17', '2023-05-15 00:00:00', '2023-05-10 00:00:00', '2023-05-15 00:00:00'),

-- Half-day examples
('leave_req_29', 'user_05', 'leave_03', '2023-06-02', '2023-06-02', 'RTT demi-journée', 'APPROVED', 'user_02', '2023-05-25 00:00:00', '2023-05-20 00:00:00', '2023-05-25 00:00:00'),
('leave_req_30', 'user_08', 'leave_03', '2023-06-02', '2023-06-02', 'RTT demi-journée', 'APPROVED', 'user_03', '2023-05-25 00:00:00', '2023-05-20 00:00:00', '2023-05-25 00:00:00'),
('leave_req_31', 'user_11', 'leave_03', '2023-06-02', '2023-06-02', 'RTT demi-journée', 'APPROVED', 'user_04', '2023-05-25 00:00:00', '2023-05-20 00:00:00', '2023-05-25 00:00:00'),
('leave_req_32', 'user_17', 'leave_03', '2023-06-02', '2023-06-02', 'RTT demi-journée', 'APPROVED', 'user_02', '2023-05-25 00:00:00', '2023-05-20 00:00:00', '2023-05-25 00:00:00'),

-- Pending requests
('leave_req_33', 'user_07', 'leave_01', '2023-12-26', '2023-12-29', 'Congés de fin d\'année', 'PENDING', NULL, NULL, '2023-10-15 00:00:00', '2023-10-15 00:00:00'),
('leave_req_34', 'user_10', 'leave_01', '2023-12-26', '2023-12-29', 'Congés de fin d\'année', 'PENDING', NULL, NULL, '2023-10-16 00:00:00', '2023-10-16 00:00:00'),
('leave_req_35', 'user_13', 'leave_01', '2023-12-26', '2023-12-29', 'Congés de fin d\'année', 'PENDING', NULL, NULL, '2023-10-17 00:00:00', '2023-10-17 00:00:00'),
('leave_req_36', 'user_19', 'leave_01', '2023-12-26', '2023-12-29', 'Congés de fin d\'année', 'PENDING', NULL, NULL, '2023-10-18 00:00:00', '2023-10-18 00:00:00'),

-- Rejected requests
('leave_req_37', 'user_06', 'leave_01', '2023-11-02', '2023-11-03', 'Pont de la Toussaint', 'REJECTED', 'user_05', '2023-10-20 00:00:00', '2023-10-10 00:00:00', '2023-10-20 00:00:00'),
('leave_req_38', 'user_09', 'leave_01', '2023-11-02', '2023-11-03', 'Pont de la Toussaint', 'REJECTED', 'user_08', '2023-10-21 00:00:00', '2023-10-11 00:00:00', '2023-10-21 00:00:00'),
('leave_req_39', 'user_14', 'leave_01', '2023-11-02', '2023-11-03', 'Pont de la Toussaint', 'REJECTED', 'user_12', '2023-10-22 00:00:00', '2023-10-12 00:00:00', '2023-10-22 00:00:00'),
('leave_req_40', 'user_20', 'leave_01', '2023-11-02', '2023-11-03', 'Pont de la Toussaint', 'REJECTED', 'user_18', '2023-10-23 00:00:00', '2023-10-13 00:00:00', '2023-10-23 00:00:00');

-- Re-enable foreign key checks and commit
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
