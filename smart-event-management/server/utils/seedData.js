const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

dotenv.config();

const getUsersData = async () => {
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  return [
    {
      name: 'Admin User',
      email: 'admin@event.com',
      password: hashedAdminPassword,
      phone: '1234567890',
      role: 'admin',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedUserPassword,
      phone: '1234567891',
      role: 'user',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedUserPassword,
      phone: '1234567892',
      role: 'user',
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedUserPassword,
      phone: '1234567893',
      role: 'user',
    },
    {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      password: hashedUserPassword,
      phone: '1234567894',
      role: 'user',
    },
    {
      name: 'David Brown',
      email: 'david@example.com',
      password: hashedUserPassword,
      phone: '1234567895',
      role: 'user',
    },
    {
      name: 'Emma Davis',
      email: 'emma@example.com',
      password: hashedUserPassword,
      phone: '1234567896',
      role: 'user',
    },
    {
      name: 'James Wilson',
      email: 'james@example.com',
      password: hashedUserPassword,
      phone: '1234567897',
      role: 'user',
    },
    {
      name: 'Olivia Martinez',
      email: 'olivia@example.com',
      password: hashedUserPassword,
      phone: '1234567898',
      role: 'user',
    },
    {
      name: 'Robert Garcia',
      email: 'robert@example.com',
      password: hashedUserPassword,
      phone: '1234567899',
      role: 'user',
    },
    {
      name: 'Sophia Anderson',
      email: 'sophia@example.com',
      password: hashedUserPassword,
      phone: '1234567800',
      role: 'user',
    },
  ];
};

const events = [
  {
    title: 'Web Development Bootcamp 2026',
    description:
      'Learn modern web development with hands-on projects. Master HTML, CSS, JavaScript, React, and Node.js in this comprehensive bootcamp.',
    category: 'Workshop',
    venue: 'Tech Hub, Building A',
    date: new Date('2026-08-15'),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    organizer: 'TechEd Academy',
    capacity: 50,
    status: 'upcoming',
  },
  {
    title: 'AI and Machine Learning Conference',
    description:
      'Explore the latest trends in AI and ML. Network with industry experts and learn about cutting-edge technologies.',
    category: 'Conference',
    venue: 'Convention Center',
    date: new Date('2026-09-20'),
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    organizer: 'AI Research Institute',
    capacity: 100,
    status: 'upcoming',
  },
  {
    title: 'Cybersecurity Awareness Seminar',
    description:
      'Understanding cybersecurity threats and best practices to protect your organization from cyber attacks.',
    category: 'Seminar',
    venue: 'Security Training Center',
    date: new Date('2026-07-25'),
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    organizer: 'CyberSafe Corp',
    capacity: 40,
    status: 'upcoming',
  },
  {
    title: 'Cloud Computing Fundamentals',
    description:
      'Introduction to cloud platforms including AWS, Azure, and Google Cloud. Learn deployment strategies and best practices.',
    category: 'Webinar',
    venue: 'Online Platform',
    date: new Date('2026-08-10'),
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    organizer: 'Cloud Masters',
    capacity: 200,
    status: 'upcoming',
  },
  {
    title: 'Mobile App Development Workshop',
    description:
      'Build cross-platform mobile apps using React Native. Create iOS and Android apps from a single codebase.',
    category: 'Workshop',
    venue: 'Innovation Lab',
    date: new Date('2026-09-05'),
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    organizer: 'Mobile Dev Academy',
    capacity: 30,
    status: 'upcoming',
  },
  {
    title: 'Data Science Meetup',
    description:
      'Monthly meetup for data science enthusiasts. Share projects, discuss trends, and network with professionals.',
    category: 'Meetup',
    venue: 'Data Science Hub',
    date: new Date('2026-07-30'),
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    organizer: 'Data Science Community',
    capacity: 60,
    status: 'upcoming',
  },
  {
    title: 'Blockchain Technology Summit',
    description:
      'Deep dive into blockchain, cryptocurrency, and decentralized applications. Learn from blockchain pioneers.',
    category: 'Conference',
    venue: 'Tech Convention Hall',
    date: new Date('2026-10-15'),
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    organizer: 'Blockchain Alliance',
    capacity: 150,
    status: 'upcoming',
  },
  {
    title: 'UI/UX Design Workshop',
    description:
      'Master user interface and user experience design principles. Create stunning and intuitive digital products.',
    category: 'Workshop',
    venue: 'Design Studio',
    date: new Date('2026-08-22'),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    organizer: 'Design Academy',
    capacity: 25,
    status: 'upcoming',
  },
  {
    title: 'DevOps Best Practices',
    description:
      'Learn CI/CD, containerization, orchestration, and infrastructure as code for modern software delivery.',
    category: 'Seminar',
    venue: 'Tech Campus',
    date: new Date('2026-09-12'),
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    organizer: 'DevOps Institute',
    capacity: 45,
    status: 'upcoming',
  },
  {
    title: 'Python Programming Bootcamp',
    description:
      'From basics to advanced Python programming. Learn data structures, algorithms, and real-world applications.',
    category: 'Workshop',
    venue: 'Programming Lab',
    date: new Date('2026-07-28'),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    organizer: 'Python Academy',
    capacity: 35,
    status: 'upcoming',
  },
  {
    title: 'Digital Marketing Strategies',
    description:
      'Master SEO, social media marketing, content strategy, and analytics to grow your business online.',
    category: 'Seminar',
    venue: 'Marketing Hub',
    date: new Date('2026-08-18'),
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    organizer: 'Digital Marketing Pro',
    capacity: 50,
    status: 'upcoming',
  },
  {
    title: 'Entrepreneurship and Startups',
    description:
      'Learn how to build, launch, and scale a successful startup. Hear from successful entrepreneurs.',
    category: 'Conference',
    venue: 'Startup Incubator',
    date: new Date('2026-09-25'),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    organizer: 'Startup Network',
    capacity: 80,
    status: 'upcoming',
  },
  {
    title: 'Game Development Workshop',
    description:
      'Create your own video games using Unity and Unreal Engine. Learn game design and programming.',
    category: 'Workshop',
    venue: 'Gaming Studio',
    date: new Date('2026-10-05'),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    organizer: 'Game Dev Academy',
    capacity: 30,
    status: 'upcoming',
  },
  {
    title: 'Internet of Things (IoT) Seminar',
    description:
      'Explore IoT devices, sensors, connectivity, and building smart solutions for real-world problems.',
    category: 'Seminar',
    venue: 'IoT Lab',
    date: new Date('2026-08-28'),
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    organizer: 'IoT Innovation',
    capacity: 40,
    status: 'upcoming',
  },
  {
    title: 'Software Testing and QA',
    description:
      'Learn manual and automated testing, test-driven development, and quality assurance best practices.',
    category: 'Workshop',
    venue: 'QA Training Center',
    date: new Date('2026-09-18'),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    organizer: 'QA Academy',
    capacity: 35,
    status: 'upcoming',
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Attendance.deleteMany();

    console.log('Existing data cleared');

    const users = await getUsersData();
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    const createdEvents = await Event.insertMany(events);
    console.log(`${createdEvents.length} events created`);

    const regularUsers = createdUsers.filter((user) => user.role === 'user');

    const registrations = [];
    const attendances = [];

    for (let i = 0; i < 30; i++) {
      const randomUser =
        regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const randomEvent =
        createdEvents[Math.floor(Math.random() * createdEvents.length)];

      const existingReg = registrations.find(
        (reg) =>
          reg.userId.toString() === randomUser._id.toString() &&
          reg.eventId.toString() === randomEvent._id.toString()
      );

      if (!existingReg) {
        registrations.push({
          userId: randomUser._id,
          eventId: randomEvent._id,
          registrationStatus: 'confirmed',
        });

        const attendanceStatus = ['present', 'absent', 'pending'][
          Math.floor(Math.random() * 3)
        ];

        attendances.push({
          userId: randomUser._id,
          eventId: randomEvent._id,
          attendanceStatus: attendanceStatus,
          checkInTime: attendanceStatus === 'present' ? new Date() : null,
        });

        randomEvent.availableSeats -= 1;
        await randomEvent.save();
      }
    }

    const createdRegistrations = await Registration.insertMany(registrations);
    console.log(`${createdRegistrations.length} registrations created`);

    const createdAttendances = await Attendance.insertMany(attendances);
    console.log(`${createdAttendances.length} attendance records created`);

    console.log('Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin - Email: admin@event.com, Password: admin123');
    console.log('User - Email: john@example.com, Password: user123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
