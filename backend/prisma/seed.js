const { connectDB, disconnectDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');
const Task = require('../models/Task');

async function main() {
  await connectDB();
  console.log('🌱 Seeding database...');
  
  // Clear existing data
  await User.deleteMany({});
  await Department.deleteMany({});
  await Task.deleteMany({});

  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Create admin user
  const admin = await User.create({
    email: 'admin@owms.com',
    name: 'hariom singh',
    role: 'admin',
    password: hashedPassword,
  });
  console.log('✓ Created admin user:', admin.email);

  // Create leadership users
  const leadershipUsers = await User.insertMany([
    {
      email: 'teamlead@owms.com',
      name: 'Team Lead User',
      role: 'team_lead',
      password: hashedPassword,
    },
    {
      email: 'tlintern@owms.com',
      name: 'Team Lead Intern User',
      role: 'team_lead_intern',
      password: hashedPassword,
    },
    {
      email: 'manager@owms.com',
      name: 'Manager User',
      role: 'manager',
      password: hashedPassword,
    },
    {
      email: 'cto@owms.com',
      name: 'CTO User',
      role: 'cto',
      password: hashedPassword,
    },
    {
      email: 'cfo@owms.com',
      name: 'CFO User',
      role: 'cfo',
      password: hashedPassword,
    },
    {
      email: 'coo@owms.com',
      name: 'COO User',
      role: 'coo',
      password: hashedPassword,
    },
    {
      email: 'ceo@owms.com',
      name: 'CEO User',
      role: 'ceo',
      password: hashedPassword,
    },
  ]);
  console.log('✓ Created', leadershipUsers.length, 'leadership users');

  // Create department
  const dept = await Department.create({
    name: 'Engineering',
    userId: admin._id,
  });
  console.log('✓ Created department:', dept.name);

  // Create intern users
  const interns = await User.insertMany([
    {
      email: 'intern@owms.com',
      name: 'Intern User',
      role: 'intern',
      password: hashedPassword,
    },
    {
      email: 'sarah.jones@owms.com',
      name: 'Sarah Jones',
      role: 'intern',
      password: hashedPassword,
    },
    {
      email: 'david.lee@owms.com',
      name: 'David Lee',
      role: 'intern',
      password: hashedPassword,
    },
    {
      email: 'emily.chen@owms.com',
      name: 'Emily Chen',
      role: 'intern',
      password: hashedPassword,
    },
    {
      email: 'michael.brown@owms.com',
      name: 'Michael Brown',
      role: 'intern',
      password: hashedPassword,
    },
    {
      email: 'jessica.wilson@owms.com',
      name: 'Jessica Wilson',
      role: 'intern',
      password: hashedPassword,
    },
  ]);

  console.log('✓ Created', interns.length, 'intern users');

  // Create sample tasks
  const now = new Date();
  const sampleTasks = [
    {
      title: 'Research Q4 Market Trends',
      description: 'Analyze and document Q4 market trends for the engineering department',
      departmentId: dept._id,
      assignedToId: interns[0]._id,
      assignedById: admin._id,
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: 'high',
      status: 'pending',
    },
    {
      title: 'Develop API Integration Draft',
      description: 'Create a draft for the new API integration module',
      departmentId: dept._id,
      assignedToId: interns[1]._id,
      assignedById: admin._id,
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      priority: 'medium',
      status: 'pending',
    },
  ];

  await Task.insertMany(sampleTasks);

  console.log('✓ Created', sampleTasks.length, 'sample tasks');

  console.log('\n✅ Database seeding completed!\n');
  console.log('Test User Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const quickLoginUsers = [
    admin,
    ...leadershipUsers,
    interns[0],
  ];

  quickLoginUsers.forEach((user) => {
    console.log(`${user.role}:`);
    console.log('  Email:', user.email);
    console.log('  Password:', defaultPassword);
  });

  console.log('\nAll Interns:');
  interns.forEach((intern, i) => {
    console.log(`  ${i + 1}. ${intern.name} (${intern.email})`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .then(async () => {
    await disconnectDB();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await disconnectDB();
    process.exit(1);
  });
