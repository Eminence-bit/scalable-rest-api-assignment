const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Task = require('../models/Task');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('Created users');

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Complete REST API Documentation',
        description: 'Write comprehensive API documentation using Swagger',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: regularUser._id
      },
      {
        title: 'Implement User Authentication',
        description: 'Set up JWT-based authentication system',
        status: 'completed',
        priority: 'high',
        createdBy: regularUser._id
      },
      {
        title: 'Design Database Schema',
        description: 'Create MongoDB schema for users and tasks',
        status: 'completed',
        priority: 'medium',
        createdBy: regularUser._id
      },
      {
        title: 'Set up Frontend UI',
        description: 'Create React components for task management',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdBy: regularUser._id
      },
      {
        title: 'Deploy to Production',
        description: 'Deploy the application to a cloud platform',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdBy: regularUser._id
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Created sample tasks');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('Admin User:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('\nRegular User:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('\nSample tasks have been created for the regular user.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();