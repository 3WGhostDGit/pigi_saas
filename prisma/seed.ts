import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import fs from 'fs'; // Import Node.js filesystem module
import path from 'path'; // Import path module for joining paths
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating IDs

// Import ONLY the necessary types/enums from Prisma
import {
  Prisma,
  ContractType,
  ContractStatus,
  LeaveRequestStatus,
  PerformanceRating,
  TrainingStatus,
  DocumentType,
} from '@prisma/client';

// --- SQL Formatting Helper ---
function escapeSqlString(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  // Escape single quotes by doubling them and wrap in single quotes
  return `'${value.replace(/'/g, "''")}'`;
}

function formatSqlValue(
  value: any,
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'decimal'
): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  switch (type) {
    case 'string':
    case 'enum': // Enums are treated as strings in the DB
      return escapeSqlString(String(value));
    case 'number':
      return String(Number(value)); // Ensure it's a number
    case 'boolean':
      return value ? '1' : '0'; // MySQL uses 1/0 for boolean
    case 'date':
      if (value instanceof Date && !isNaN(value.getTime())) {
        return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`; // Format as 'YYYY-MM-DD HH:MM:SS'
      }
      return 'NULL';
    case 'decimal':
      // Assuming value is already a number or can be parsed
      const num = parseFloat(value);
      return isNaN(num) ? 'NULL' : String(num);
    default:
      return escapeSqlString(String(value));
  }
}

async function main() {
  console.log(`Start generating seed.sql ...`);

  let sqlStatements: string[] = [];

  // Add SQL preamble
  sqlStatements.push('START TRANSACTION;');
  sqlStatements.push('SET FOREIGN_KEY_CHECKS=0;'); // Disable checks during insert
  sqlStatements.push('');

  // --- Clear Data Statements (Optional but recommended) ---
  // Add DELETE statements in reverse order of dependency
  sqlStatements.push('-- Clear existing data (optional)');
  sqlStatements.push('DELETE FROM `role_permissions`;');
  sqlStatements.push('DELETE FROM `user_roles`;');
  sqlStatements.push('DELETE FROM `employee_documents`;');
  sqlStatements.push('DELETE FROM `emergency_contacts`;');
  sqlStatements.push('DELETE FROM `employee_trainings`;');
  sqlStatements.push('DELETE FROM `trainings`;');
  sqlStatements.push('DELETE FROM `employee_benefits`;');
  sqlStatements.push('DELETE FROM `benefits`;');
  sqlStatements.push('DELETE FROM `performance_reviews`;');
  sqlStatements.push('DELETE FROM `salary_history`;');
  sqlStatements.push('DELETE FROM `employee_contracts`;');
  sqlStatements.push('DELETE FROM `leave_requests`;');
  sqlStatements.push('DELETE FROM `accounts`;'); // Assuming safe to clear
  sqlStatements.push('DELETE FROM `sessions`;'); // Assuming safe to clear
  // Keep foundational data like users (especially admin), roles, permissions, departments, leave types
  sqlStatements.push("DELETE FROM `users` WHERE `email` != 'admin@example.com';");
  sqlStatements.push('');

  // --- Generate Foundational Data ---
  console.log('Generating SQL for foundational data...');

  // Roles
  const adminRoleId = `role_${uuidv4()}`;
  const managerRoleId = `role_${uuidv4()}`;
  const employeeRoleId = `role_${uuidv4()}`;
  sqlStatements.push(
    `INSERT INTO \`roles\` (id, name, description) VALUES (${formatSqlValue(adminRoleId, 'string')}, 'ADMIN', 'Administrator with full access') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`roles\` (id, name, description) VALUES (${formatSqlValue(managerRoleId, 'string')}, 'MANAGER', 'Manager of a team/department') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`roles\` (id, name, description) VALUES (${formatSqlValue(employeeRoleId, 'string')}, 'EMPLOYEE', 'Regular employee') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );

  // Permissions
  const manageAllPermId = `perm_${uuidv4()}`;
  const readUserPermId = `perm_${uuidv4()}`;
  const manageUserPermId = `perm_${uuidv4()}`;
  const readLeavePermId = `perm_${uuidv4()}`;
  const manageLeavePermId = `perm_${uuidv4()}`;
  const approveLeavePermId = `perm_${uuidv4()}`;
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(manageAllPermId, 'string')}, 'manage', 'all', 'Manage all resources') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(readUserPermId, 'string')}, 'read', 'User', 'Read user information') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(manageUserPermId, 'string')}, 'manage', 'User', 'Manage user information') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(readLeavePermId, 'string')}, 'read', 'LeaveRequest', 'Read leave requests') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(manageLeavePermId, 'string')}, 'manage', 'LeaveRequest', 'Manage leave requests') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );
  sqlStatements.push(
    `INSERT INTO \`permissions\` (id, action, subject, description) VALUES (${formatSqlValue(approveLeavePermId, 'string')}, 'approve', 'LeaveRequest', 'Approve/Reject leave requests') ON DUPLICATE KEY UPDATE action=VALUES(action), subject=VALUES(subject);`
  );

  // Role Permissions
  sqlStatements.push('-- Role Permissions');
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(adminRoleId, 'string')}, ${formatSqlValue(manageAllPermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(managerRoleId, 'string')}, ${formatSqlValue(readUserPermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(managerRoleId, 'string')}, ${formatSqlValue(readLeavePermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(managerRoleId, 'string')}, ${formatSqlValue(manageLeavePermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(managerRoleId, 'string')}, ${formatSqlValue(approveLeavePermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(employeeRoleId, 'string')}, ${formatSqlValue(readUserPermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(employeeRoleId, 'string')}, ${formatSqlValue(readLeavePermId, 'string')});`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`role_permissions\` (roleId, permissionId) VALUES (${formatSqlValue(employeeRoleId, 'string')}, ${formatSqlValue(manageLeavePermId, 'string')});`
  );

  // Departments
  const dgDeptId = `dept_${uuidv4()}`;
  const techDeptId = `dept_${uuidv4()}`;
  const hrDeptId = `dept_${uuidv4()}`;
  const finDeptId = `dept_${uuidv4()}`;
  const devDeptId = `dept_${uuidv4()}`;
  const opsDeptId = `dept_${uuidv4()}`;
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(dgDeptId, 'string')}, 'Direction Générale', NULL, NULL) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(techDeptId, 'string')}, 'Technologie', NULL, ${formatSqlValue(dgDeptId, 'string')}) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(hrDeptId, 'string')}, 'Ressources Humaines', NULL, ${formatSqlValue(dgDeptId, 'string')}) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(finDeptId, 'string')}, 'Finance', NULL, ${formatSqlValue(dgDeptId, 'string')}) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(devDeptId, 'string')}, 'Développement Logiciel', NULL, ${formatSqlValue(techDeptId, 'string')}) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`departments\` (id, name, description, parentId) VALUES (${formatSqlValue(opsDeptId, 'string')}, 'Opérations IT', NULL, ${formatSqlValue(techDeptId, 'string')}) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );

  // Leave Types
  const paidLeaveId = `leave_${uuidv4()}`;
  const sickLeaveId = `leave_${uuidv4()}`;
  const rttLeaveId = `leave_${uuidv4()}`;
  sqlStatements.push(
    `INSERT INTO \`leave_types\` (id, name, description) VALUES (${formatSqlValue(paidLeaveId, 'string')}, 'Congé Payé', 'Congés annuels payés') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`leave_types\` (id, name, description) VALUES (${formatSqlValue(sickLeaveId, 'string')}, 'Maladie', 'Absence pour cause de maladie') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT INTO \`leave_types\` (id, name, description) VALUES (${formatSqlValue(rttLeaveId, 'string')}, 'RTT', 'Récupération du Temps de Travail') ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push('');

  // --- Generate Users ---
  console.log('Generating SQL for users...');
  const hashedPassword = await bcrypt.hash('password123', 10); // Use a secure password
  const usersData: any[] = []; // Store generated user data including ID

  // Admin User (ensure it exists or insert)
  const adminUserId = `user_${uuidv4()}`;
  usersData.push({
    id: adminUserId,
    email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: hashedPassword,
    emailVerified: new Date(),
      jobTitle: 'System Admin',
    departmentId: techDeptId,
    managerId: null,
    entryDate: faker.date.past({ years: 5 }),
    roleId: adminRoleId,
  });
  sqlStatements.push(
    `INSERT INTO \`users\` (id, email, name, hashedPassword, emailVerified, jobTitle, departmentId, managerId, entryDate, createdAt, updatedAt) VALUES (${formatSqlValue(adminUserId, 'string')}, 'admin@example.com', 'Admin User', ${formatSqlValue(hashedPassword, 'string')}, ${formatSqlValue(new Date(), 'date')}, 'System Admin', ${formatSqlValue(techDeptId, 'string')}, NULL, ${formatSqlValue(usersData[0].entryDate, 'date')}, NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`user_roles\` (userId, roleId) VALUES (${formatSqlValue(adminUserId, 'string')}, ${formatSqlValue(adminRoleId, 'string')});`
  );

  // Tech Manager
  const managerTechId = `user_${uuidv4()}`;
  usersData.push({
    id: managerTechId,
    email: 'manager.tech@example.com',
    name: faker.person.fullName({ firstName: 'Bob', lastName: 'Martin' }),
      hashedPassword: hashedPassword,
    emailVerified: new Date(),
    jobTitle: 'Directeur Technique',
    departmentId: techDeptId,
    managerId: null,
    entryDate: faker.date.past({ years: 5 }),
    roleId: managerRoleId,
  });
  sqlStatements.push(
    `INSERT INTO \`users\` (id, email, name, hashedPassword, emailVerified, jobTitle, departmentId, managerId, entryDate, createdAt, updatedAt) VALUES (${formatSqlValue(managerTechId, 'string')}, 'manager.tech@example.com', ${formatSqlValue(usersData[1].name, 'string')}, ${formatSqlValue(hashedPassword, 'string')}, ${formatSqlValue(new Date(), 'date')}, 'Directeur Technique', ${formatSqlValue(techDeptId, 'string')}, NULL, ${formatSqlValue(usersData[1].entryDate, 'date')}, NOW(), NOW()) ON DUPLICATE KEY UPDATE email=VALUES(email);`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`user_roles\` (userId, roleId) VALUES (${formatSqlValue(managerTechId, 'string')}, ${formatSqlValue(managerRoleId, 'string')});`
  );

  // HR Manager
  const managerHRId = `user_${uuidv4()}`;
  usersData.push({
    id: managerHRId,
    email: 'manager.hr@example.com',
    name: faker.person.fullName({ firstName: 'David', lastName: 'Lefebvre' }),
      hashedPassword: hashedPassword,
    emailVerified: new Date(),
    jobTitle: 'Responsable RH',
    departmentId: hrDeptId,
    managerId: null,
    entryDate: faker.date.past({ years: 4 }),
    roleId: managerRoleId,
  });
  sqlStatements.push(
    `INSERT INTO \`users\` (id, email, name, hashedPassword, emailVerified, jobTitle, departmentId, managerId, entryDate, createdAt, updatedAt) VALUES (${formatSqlValue(managerHRId, 'string')}, 'manager.hr@example.com', ${formatSqlValue(usersData[2].name, 'string')}, ${formatSqlValue(hashedPassword, 'string')}, ${formatSqlValue(new Date(), 'date')}, 'Responsable RH', ${formatSqlValue(hrDeptId, 'string')}, NULL, ${formatSqlValue(usersData[2].entryDate, 'date')}, NOW(), NOW()) ON DUPLICATE KEY UPDATE email=VALUES(email);`
  );
  sqlStatements.push(
    `INSERT IGNORE INTO \`user_roles\` (userId, roleId) VALUES (${formatSqlValue(managerHRId, 'string')}, ${formatSqlValue(managerRoleId, 'string')});`
  );

  // Generate Employee Users
  const userCount = 20;
  const departments = [
    { id: devDeptId, managerId: managerTechId },
    { id: opsDeptId, managerId: managerTechId },
    { id: hrDeptId, managerId: managerHRId },
    { id: finDeptId, managerId: managerHRId }, // Assuming HR Manager supervises Finance for demo
  ];

  for (let i = 0; i < userCount; i++) {
    const userId = `user_${uuidv4()}`;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const departmentInfo = faker.helpers.arrayElement(departments);
    const entryDate = faker.date.past({ years: 3 });

    usersData.push({
      id: userId,
      email: email,
      name: `${firstName} ${lastName}`,
      hashedPassword: hashedPassword,
      emailVerified: faker.date.past({ years: 2 }),
      image: faker.image.avatar(),
      jobTitle: faker.person.jobTitle(),
      departmentId: departmentInfo.id,
      managerId: departmentInfo.managerId,
      entryDate: entryDate,
      roleId: employeeRoleId,
    });

    sqlStatements.push(
      `INSERT INTO \`users\` (id, email, name, hashedPassword, emailVerified, image, jobTitle, departmentId, managerId, entryDate, createdAt, updatedAt) VALUES (${formatSqlValue(userId, 'string')}, ${formatSqlValue(email, 'string')}, ${formatSqlValue(usersData[usersData.length - 1].name, 'string')}, ${formatSqlValue(hashedPassword, 'string')}, ${formatSqlValue(usersData[usersData.length - 1].emailVerified, 'date')}, ${formatSqlValue(usersData[usersData.length - 1].image, 'string')}, ${formatSqlValue(usersData[usersData.length - 1].jobTitle, 'string')}, ${formatSqlValue(departmentInfo.id, 'string')}, ${formatSqlValue(departmentInfo.managerId, 'string')}, ${formatSqlValue(entryDate, 'date')}, NOW(), NOW()) ON DUPLICATE KEY UPDATE email=VALUES(email);`
    );
    sqlStatements.push(
      `INSERT IGNORE INTO \`user_roles\` (userId, roleId) VALUES (${formatSqlValue(userId, 'string')}, ${formatSqlValue(employeeRoleId, 'string')});`
    );
  }
  console.log(`${usersData.length} users generated.`);
  sqlStatements.push('');

  // --- Generate Global HR Data (Benefits, Trainings) ---
  console.log('Generating SQL for global HR data...');
  const benefits = [];
  const benefitsData = [
    { name: 'Health Insurance Plan A', description: 'Comprehensive health coverage', provider: 'Allianz', costPerMonth: 150, companyContribution: 100, employeeContribution: 50 },
    { name: 'Meal Vouchers', description: 'Daily meal allowance', provider: 'Sodexo', costPerMonth: 180, companyContribution: 90, employeeContribution: 90 },
    { name: 'Gym Membership Discount', description: 'Discounted access to partner gyms', provider: 'Fitness Park', costPerMonth: 40, companyContribution: 20, employeeContribution: 20 },
    { name: 'Public Transport Subsidy', description: 'Partial reimbursement', provider: 'Regional Transport', costPerMonth: 75, companyContribution: 37.5, employeeContribution: 37.5 },
  ];
  for (const data of benefitsData) {
      const benefitId = `benefit_${uuidv4()}`;
      benefits.push({ id: benefitId, ...data });
      sqlStatements.push(
          `INSERT INTO \`benefits\` (id, name, description, provider, costPerMonth, employeeContribution, companyContribution, isActive, createdAt, updatedAt) VALUES (${formatSqlValue(benefitId, 'string')}, ${formatSqlValue(data.name, 'string')}, ${formatSqlValue(data.description, 'string')}, ${formatSqlValue(data.provider, 'string')}, ${formatSqlValue(data.costPerMonth, 'decimal')}, ${formatSqlValue(data.employeeContribution, 'decimal')}, ${formatSqlValue(data.companyContribution, 'decimal')}, 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name);`
      );
  }

  const trainings = [];
  const trainingsData = [
    { name: 'Advanced React Development', description: 'Deep dive', provider: 'Udemy', duration: 20, cost: 100, isMandatory: false },
    { name: 'Cybersecurity Awareness', description: 'Basic security', provider: 'Internal', duration: 2, cost: 0, isMandatory: true },
    { name: 'Project Management Fundamentals', description: 'Agile/Scrum', provider: 'Coursera', duration: 40, cost: 500, isMandatory: false },
    { name: 'Effective Communication', description: 'Workplace communication', provider: 'Internal HR', duration: 4, cost: 0, isMandatory: false },
  ];
  for (const data of trainingsData) {
      const trainingId = `training_${uuidv4()}`;
      trainings.push({ id: trainingId, ...data });
      sqlStatements.push(
          `INSERT INTO \`trainings\` (id, name, description, provider, duration, cost, startDate, endDate, isMandatory, createdAt, updatedAt) VALUES (${formatSqlValue(trainingId, 'string')}, ${formatSqlValue(data.name, 'string')}, ${formatSqlValue(data.description, 'string')}, ${formatSqlValue(data.provider, 'string')}, ${formatSqlValue(data.duration, 'number')}, ${formatSqlValue(data.cost, 'decimal')}, NULL, NULL, ${formatSqlValue(data.isMandatory, 'boolean')}, NOW(), NOW());` // Assuming create only for simplicity
      );
  }
  sqlStatements.push('');

  // --- Generate HR-Specific Data for Users ---
  console.log('Generating SQL for user-specific HR data...');
  for (const user of usersData) {
    // Employee Contract
    const contractId = `contract_${uuidv4()}`;
    const contractType = faker.helpers.arrayElement(Object.values(ContractType));
    const startDate = faker.date.past({ years: user.entryDate ? (new Date().getFullYear() - user.entryDate.getFullYear()) : 5 });
    let endDate: Date | null = null;
    let status = ContractStatus.ACTIVE;
    if (contractType === ContractType.FIXED_TERM || contractType === ContractType.INTERNSHIP || contractType === ContractType.APPRENTICESHIP) {
        endDate = faker.date.future({ years: 1, refDate: startDate });
        if (faker.datatype.boolean(0.1)) { endDate = faker.date.past({ years: 1, refDate: new Date() }); status = ContractStatus.ENDED; }
    } else if (contractType === ContractType.FREELANCE) {
        status = faker.helpers.arrayElement([ContractStatus.ACTIVE, ContractStatus.ENDED]);
        if (status === ContractStatus.ENDED) { endDate = faker.date.past({ years: 1 }); }
    } else {
        if (faker.datatype.boolean(0.05)) { status = ContractStatus.TERMINATED; endDate = faker.date.past({ years: 1 }); }
    }

    sqlStatements.push(
      `INSERT INTO \`employee_contracts\` (id, userId, contractType, status, startDate, endDate, jobTitle, salary, currency, workingHours, trialPeriodEndDate, createdAt, updatedAt) VALUES (${formatSqlValue(contractId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(contractType, 'enum')}, ${formatSqlValue(status, 'enum')}, ${formatSqlValue(startDate, 'date')}, ${formatSqlValue(endDate, 'date')}, ${formatSqlValue(user.jobTitle, 'string')}, ${formatSqlValue(faker.number.int({ min: 30000, max: 120000 }), 'decimal')}, 'EUR', ${formatSqlValue(faker.helpers.arrayElement([35, 37.5, 39, 40]), 'number')}, ${formatSqlValue(faker.date.soon({ days: 90, refDate: startDate }), 'date')}, NOW(), NOW());`
    );

    // Salary History
    const salaryCount = faker.number.int({ min: 1, max: 3 });
    let currentSalary = faker.number.int({ min: 30000, max: 120000 });
    let lastDate = faker.date.past({ years: 3, refDate: user.entryDate ?? new Date() });
    for (let i = 0; i < salaryCount; i++) {
      const salaryId = `salary_${uuidv4()}`;
      lastDate = faker.date.past({ years: 1, refDate: lastDate });
      currentSalary += faker.number.int({ min: 1000, max: 5000 });
      sqlStatements.push(
          `INSERT INTO \`salary_history\` (id, userId, amount, currency, effectiveDate, reason, createdAt) VALUES (${formatSqlValue(salaryId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(currentSalary, 'decimal')}, 'EUR', ${formatSqlValue(lastDate, 'date')}, ${formatSqlValue(faker.lorem.sentence(), 'string')}, NOW());`
      );
    }

    // Performance Reviews
    const reviewCount = faker.number.int({ min: 0, max: 2 });
    for (let i = 0; i < reviewCount; i++) {
      if (user.managerId) {
        const reviewId = `review_${uuidv4()}`;
        const reviewDate = faker.date.past({ years: i + 1 });
        sqlStatements.push(
          `INSERT INTO \`performance_reviews\` (id, userId, reviewerId, reviewDate, periodStartDate, periodEndDate, rating, strengths, weaknesses, goals, comments, createdAt, updatedAt) VALUES (${formatSqlValue(reviewId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(user.managerId, 'string')}, ${formatSqlValue(reviewDate, 'date')}, ${formatSqlValue(faker.date.recent({ days: 365, refDate: reviewDate }), 'date')}, ${formatSqlValue(reviewDate, 'date')}, ${formatSqlValue(faker.helpers.arrayElement(Object.values(PerformanceRating)), 'enum')}, ${formatSqlValue(faker.lorem.paragraph(), 'string')}, ${formatSqlValue(faker.lorem.paragraph(), 'string')}, ${formatSqlValue(faker.lorem.sentence(), 'string')}, ${formatSqlValue(faker.lorem.sentence(), 'string')}, NOW(), NOW());`
        );
      }
    }

    // Emergency Contacts
     const contactCount = faker.number.int({ min: 1, max: 2 });
     for (let i = 0; i < contactCount; i++) {
        const contactId = `contact_${uuidv4()}`;
         sqlStatements.push(
             `INSERT INTO \`emergency_contacts\` (id, userId, name, relationship, phone, email, address, isPrimary, createdAt, updatedAt) VALUES (${formatSqlValue(contactId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(faker.person.fullName(), 'string')}, ${formatSqlValue(faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']), 'string')}, ${formatSqlValue(faker.phone.number(), 'string')}, ${formatSqlValue(faker.internet.email(), 'string')}, NULL, ${formatSqlValue(i === 0, 'boolean')}, NOW(), NOW());`
         );
     }

     // Employee Documents
     const docCount = faker.number.int({ min: 0, max: 3 });
     for(let i=0; i < docCount; i++) {
        const docId = `doc_${uuidv4()}`;
        const fileName = faker.system.fileName() + '.pdf';
         sqlStatements.push(
            `INSERT INTO \`employee_documents\` (id, userId, documentType, fileName, fileUrl, description, issueDate, expiryDate, uploadedAt, updatedAt) VALUES (${formatSqlValue(docId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(faker.helpers.arrayElement(Object.values(DocumentType)), 'enum')}, ${formatSqlValue(fileName, 'string')}, ${formatSqlValue(faker.internet.url() + '/' + fileName, 'string')}, ${formatSqlValue(faker.lorem.sentence(), 'string')}, ${formatSqlValue(faker.date.past({ years: 2 }), 'date')}, ${formatSqlValue(faker.datatype.boolean(0.7) ? faker.date.future({ years: 3 }) : null, 'date')}, NOW(), NOW());`
         );
     }

     // Leave Requests
     const leaveCount = faker.number.int({ min: 1, max: 5 });
     for (let i = 0; i < leaveCount; i++) {
        const leaveId = `leave_req_${uuidv4()}`;
        const leaveStartDate = faker.date.between({ from: user.entryDate ?? faker.date.past({years: 2}), to: faker.date.future({ years: 1}) });
        const leaveEndDate = faker.date.soon({ days: faker.number.int({ min: 1, max: 10 }), refDate: leaveStartDate });
        const status = faker.helpers.arrayElement(Object.values(LeaveRequestStatus));
        let approverId = null;
        let approvedAt = null;
        if (status === LeaveRequestStatus.APPROVED || status === LeaveRequestStatus.REJECTED) {
            approverId = user.managerId ?? managerHRId;
            approvedAt = faker.date.soon({ days: 5, refDate: leaveStartDate });
        }
        sqlStatements.push(
            `INSERT INTO \`leave_requests\` (id, userId, leaveTypeId, startDate, endDate, reason, status, createdAt, updatedAt, approverId, approvedAt) VALUES (${formatSqlValue(leaveId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(faker.helpers.arrayElement([paidLeaveId, sickLeaveId, rttLeaveId]), 'string')}, ${formatSqlValue(leaveStartDate, 'date')}, ${formatSqlValue(leaveEndDate, 'date')}, ${formatSqlValue(faker.lorem.sentence(), 'string')}, ${formatSqlValue(status, 'enum')}, NOW(), NOW(), ${formatSqlValue(approverId, 'string')}, ${formatSqlValue(approvedAt, 'date')});`
        );
     }

     // Employee Benefits
    const assignedBenefitCount = faker.number.int({ min: 1, max: 3 });
    const benefitsToAssign = faker.helpers.shuffle(benefits).slice(0, assignedBenefitCount);
    for (const benefit of benefitsToAssign) {
      const empBenefitId = `emp_benefit_${uuidv4()}`;
      sqlStatements.push(
        `INSERT INTO \`employee_benefits\` (id, userId, benefitId, startDate, endDate, notes, createdAt, updatedAt) VALUES (${formatSqlValue(empBenefitId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(benefit.id, 'string')}, ${formatSqlValue(faker.date.past({ years: 1, refDate: user.entryDate ?? new Date() }), 'date')}, NULL, NULL, NOW(), NOW());`
      );
    }

    // Employee Trainings
    const assignedTrainingCount = faker.number.int({ min: 0, max: 2 });
    const trainingsToAssign = faker.helpers.shuffle(trainings).slice(0, assignedTrainingCount);
     for (const training of trainingsToAssign) {
        const empTrainingId = `emp_training_${uuidv4()}`;
       sqlStatements.push(
         `INSERT INTO \`employee_trainings\` (id, userId, trainingId, status, completionDate, score, certificateUrl, notes, createdAt, updatedAt) VALUES (${formatSqlValue(empTrainingId, 'string')}, ${formatSqlValue(user.id, 'string')}, ${formatSqlValue(training.id, 'string')}, ${formatSqlValue(faker.helpers.arrayElement(Object.values(TrainingStatus)), 'enum')}, ${formatSqlValue(faker.date.past({ years: 1 }), 'date')}, NULL, NULL, NULL, NOW(), NOW());`
       );
     }
     sqlStatements.push(''); // Add newline between users for readability
  }

  // --- Add SQL Postamble ---
  sqlStatements.push('SET FOREIGN_KEY_CHECKS=1;'); // Re-enable checks
  sqlStatements.push('COMMIT;');

  // --- Write to File ---
  const sqlFilePath = path.join(__dirname, 'seed.sql'); // Output file in prisma directory
  fs.writeFileSync(sqlFilePath, sqlStatements.join('\n'), 'utf-8');

  console.log(`Finished generating seed.sql at ${sqlFilePath}`);
  console.log(`You can now import this file using phpMyAdmin or MySQL command line.`);
}

main().catch((e) => {
  console.error('Error generating seed SQL:', e);
    process.exit(1);
  }); 