/**
 * ensureDemoUsers.js
 *
 * Runs automatically on every server startup.
 * Creates the two demo accounts (admin + user) if they do not already exist
 * in the database.
 *
 * Why this approach:
 *   - The production database (MongoDB Atlas) was never seeded manually.
 *   - We cannot run `npm run seed` on a cloud host like Render/Railway without
 *     a one-off job.
 *   - This utility is idempotent: it checks before inserting, so running it
 *     100 times creates each account at most once.
 *   - It does NOT delete or modify any existing user data.
 *   - Passwords are hashed with bcrypt (salt rounds = 10) before insertion,
 *     matching exactly how the User model's pre-save hook hashes them.
 *     We insert via User.create() so the pre-save hook fires automatically.
 */

const bcrypt = require('bcrypt');
const User = require('../models/User');

const DEMO_USERS = [
  {
    name: 'Admin User',
    email: 'admin@event.com',
    password: 'admin123',
    phone: '1234567890',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    phone: '1234567891',
    role: 'user',
  },
];

const ensureDemoUsers = async () => {
  try {
    for (const demo of DEMO_USERS) {
      const exists = await User.findOne({ email: demo.email });

      if (!exists) {
        // Use User.create() so the pre-save bcrypt hook fires correctly
        await User.create({
          name:     demo.name,
          email:    demo.email,
          password: demo.password,   // hook will hash this
          phone:    demo.phone,
          role:     demo.role,
        });
        console.log(`✅ Demo user created: ${demo.email} (${demo.role})`);
      } else {
        console.log(`ℹ️  Demo user already exists: ${demo.email}`);
      }
    }
  } catch (error) {
    // Never crash the server over this — just log and continue
    console.error('⚠️  ensureDemoUsers error:', error.message);
  }
};

module.exports = ensureDemoUsers;
