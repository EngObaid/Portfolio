import mongoose from 'mongoose';
import { env } from '../config/env';
import User from '../models/User';
import { connectDB } from '../config/db';

export const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
    if (existingAdmin) {
        console.log('Admin already exists');
        process.exit(0);
    }

    const admin = await User.create({
      email: env.ADMIN_EMAIL,
      passwordHash: env.ADMIN_PASSWORD,
    });

    console.log('Admin User Created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

// createAdmin();
