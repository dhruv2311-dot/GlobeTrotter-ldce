import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing database records
  // We delete in dependency order (Activity -> City -> Country -> UserPreference -> User)
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemConfig.deleteMany({});

  console.log('🧹 Cleaned existing database tables.');

  // 2. Seed System Configurations
  await prisma.systemConfig.createMany({
    data: [
      { key: 'APP_NAME', value: 'GlobeTrotter' },
      { key: 'VERSION', value: '1.0.0-sprint2' },
      { key: 'MAINTENANCE_MODE', value: 'false' },
    ],
  });
  console.log('✅ Seeded system configurations.');

  // 3. Seed Users & UserPreferences
  const hashedUserPassword = await bcrypt.hash('Traveler123!', 10);
  const hashedAdminPassword = await bcrypt.hash('AdminSecret99!', 10);

  // Standard user
  const traveler = await prisma.user.create({
    data: {
      firstName: 'Dhruv',
      lastName: 'Traveler',
      username: 'dhruv123',
      email: 'dhruv@example.com',
      passwordHash: hashedUserPassword,
      phone: '9999999999',
      city: 'Ahmedabad',
      country: 'India',
      bio: 'Avid traveler and planner, exploring the world one city at a time.',
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      role: Role.USER,
      isEmailVerified: true,
      preference: {
        create: {
          language: 'en',
        },
      },
    },
  });

  // Admin user
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'GlobeTrotter',
      username: 'admin',
      email: 'admin@globetrotter.com',
      passwordHash: hashedAdminPassword,
      phone: '1234567890',
      city: 'Paris',
      country: 'France',
      bio: 'Platform administration account.',
      role: Role.ADMIN,
      isEmailVerified: true,
      preference: {
        create: {
          language: 'en',
        },
      },
    },
  });

  console.log(`✅ Seeded users: ${traveler.email} (USER), ${admin.email} (ADMIN).`);

  // 4. Seed Countries
  const inCountry = await prisma.country.create({ data: { name: 'India', code: 'IN' } });
  const frCountry = await prisma.country.create({ data: { name: 'France', code: 'FR' } });
  const jpCountry = await prisma.country.create({ data: { name: 'Japan', code: 'JP' } });
  const ukCountry = await prisma.country.create({ data: { name: 'United Kingdom', code: 'GB' } });
  const itCountry = await prisma.country.create({ data: { name: 'Italy', code: 'IT' } });
  const usCountry = await prisma.country.create({ data: { name: 'United States', code: 'US' } });

  console.log('✅ Seeded countries.');

  // 5. Seed Cities
  const citiesData = [
    // India
    {
      countryId: inCountry.id,
      name: 'Ahmedabad',
      region: 'Asia',
      description: 'UNESCO World Heritage city famous for its history, food, and architecture.',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7',
      costIndex: 2,
      popularityScore: 4.2,
      latitude: 23.0225,
      longitude: 72.5714,
    },
    {
      countryId: inCountry.id,
      name: 'Mumbai',
      region: 'Asia',
      description: 'The city of dreams, home to Bollywood and historical monuments.',
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445',
      costIndex: 3,
      popularityScore: 4.5,
      latitude: 19.0760,
      longitude: 72.8777,
    },
    {
      countryId: inCountry.id,
      name: 'Delhi',
      region: 'Asia',
      description: 'Indias capital, boasting massive historical landmarks and rich street food culture.',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      costIndex: 3,
      popularityScore: 4.4,
      latitude: 28.7041,
      longitude: 77.1025,
    },
    // France
    {
      countryId: frCountry.id,
      name: 'Paris',
      region: 'Europe',
      description: 'The city of light, romance, high fashion, and culinary excellence.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      costIndex: 5,
      popularityScore: 5.0,
      latitude: 48.8566,
      longitude: 2.3522,
    },
    // United Kingdom
    {
      countryId: ukCountry.id,
      name: 'London',
      region: 'Europe',
      description: 'A global capital combining rich history with modern art, culture, and finance.',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      costIndex: 5,
      popularityScore: 4.9,
      latitude: 51.5074,
      longitude: -0.1278,
    },
    // Italy
    {
      countryId: itCountry.id,
      name: 'Rome',
      region: 'Europe',
      description: 'The Eternal City, holding nearly 3,000 years of globally influential art, architecture, and culture.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      costIndex: 4,
      popularityScore: 4.8,
      latitude: 41.9028,
      longitude: 12.4964,
    },
    // Japan
    {
      countryId: jpCountry.id,
      name: 'Tokyo',
      region: 'Asia',
      description: 'A neon-lit metropolis combining historic temples and ultra-modern skyscrapers.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7',
      costIndex: 4,
      popularityScore: 4.9,
      latitude: 35.6762,
      longitude: 139.6503,
    },
    // United States
    {
      countryId: usCountry.id,
      name: 'New York',
      region: 'North America',
      description: 'The Big Apple, featuring Broadway, Central Park, and the iconic skyline.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      costIndex: 5,
      popularityScore: 4.9,
      latitude: 40.7128,
      longitude: -74.0060,
    },
  ];

  const dbCities = [];
  for (const city of citiesData) {
    const created = await prisma.city.create({ data: city });
    dbCities.push(created);
  }
  console.log(`✅ Seeded ${dbCities.length} cities.`);

  // Helpers to fetch specific city IDs
  const getCityId = (name: string) => dbCities.find(c => c.name === name)!.id;

  // 6. Seed Activities
  const activitiesData = [
    // Paris
    {
      cityId: getCityId('Paris'),
      name: 'Eiffel Tower Guided Tour',
      description: 'Ascend the landmark tower with a guide and view the spectacular Parisian skyline.',
      type: 'sightseeing',
      estimatedCost: 3500.0,
      durationMinutes: 120,
      image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee87',
    },
    {
      cityId: getCityId('Paris'),
      name: 'Louvre Museum Tour',
      description: 'Skip the line and explore classical art treasures including the Mona Lisa.',
      type: 'culture',
      estimatedCost: 2200.0,
      durationMinutes: 180,
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c',
    },
    {
      cityId: getCityId('Paris'),
      name: 'Seine River Cruise',
      description: 'Enjoy a leisurely boat ride down the Seine viewing historical monuments.',
      type: 'leisure',
      estimatedCost: 1500.0,
      durationMinutes: 60,
      image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f',
    },
    // London
    {
      cityId: getCityId('London'),
      name: 'Tower of London Tour',
      description: 'See the Crown Jewels, the White Tower, and meet the Yeoman Warders.',
      type: 'history',
      estimatedCost: 2800.0,
      durationMinutes: 150,
      image: 'https://images.unsplash.com/photo-1551640536-312d58a31b4e',
    },
    {
      cityId: getCityId('London'),
      name: 'London Eye Flight',
      description: 'Enjoy a rotation on the giant Ferris wheel on the South Bank of the River Thames.',
      type: 'sightseeing',
      estimatedCost: 2400.0,
      durationMinutes: 45,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    },
    // Rome
    {
      cityId: getCityId('Rome'),
      name: 'Colosseum & Roman Forum Tour',
      description: 'Explore the ancient gladiatorial arena and walk the political heart of Roman history.',
      type: 'history',
      estimatedCost: 3000.0,
      durationMinutes: 180,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    },
    {
      cityId: getCityId('Rome'),
      name: 'Vatican Museums & Sistine Chapel',
      description: 'Admire the famous frescoes by Michelangelo and explore vast papal art collections.',
      type: 'culture',
      estimatedCost: 2500.0,
      durationMinutes: 240,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    },
    // Tokyo
    {
      cityId: getCityId('Tokyo'),
      name: 'Shinjuku Street Food Tour',
      description: 'Sample local yakitori, ramen, and sake in the hidden alleys of Omoide Yokocho.',
      type: 'food',
      estimatedCost: 4500.0,
      durationMinutes: 150,
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    },
    {
      cityId: getCityId('Tokyo'),
      name: 'Mount Fuji Day Trip',
      description: 'Take a guided bus trip to Mount Fujis 5th station and beautiful Lake Kawaguchi.',
      type: 'nature',
      estimatedCost: 7500.0,
      durationMinutes: 600,
      image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
    },
    // New York
    {
      cityId: getCityId('New York'),
      name: 'Statue of Liberty Ferry',
      description: 'Take a ferry out to Liberty Island and Ellis Island immigration museum.',
      type: 'sightseeing',
      estimatedCost: 2200.0,
      durationMinutes: 240,
      image: 'https://images.unsplash.com/photo-1522083165195-342750297f05',
    },
    // Ahmedabad
    {
      cityId: getCityId('Ahmedabad'),
      name: 'Sabarmati Ashram Visit',
      description: 'Visit the peaceful residence of Mahatma Gandhi and learn about Indias struggle for independence.',
      type: 'history',
      estimatedCost: 0.0,
      durationMinutes: 90,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7',
    },
    {
      cityId: getCityId('Ahmedabad'),
      name: 'Adalaj Stepwell Exploration',
      description: 'Marvel at the 5-story deep 15th-century stepwell displaying intricate Hindu carvings.',
      type: 'architecture',
      estimatedCost: 100.0,
      durationMinutes: 60,
      image: 'https://images.unsplash.com/photo-1622329712076-2e8d35f6060c',
    },
    {
      cityId: getCityId('Ahmedabad'),
      name: 'Manek Chowk Street Food Crawl',
      description: 'Experience the jewelry market that transforms into a night street food hub.',
      type: 'food',
      estimatedCost: 500.0,
      durationMinutes: 120,
      image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78',
    },
    // Mumbai
    {
      cityId: getCityId('Mumbai'),
      name: 'Dharavi Slum Tour',
      description: 'A respectful tour highlighting the small industries and community spirit of Dharavi.',
      type: 'culture',
      estimatedCost: 1200.0,
      durationMinutes: 150,
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1',
    },
  ];

  await prisma.activity.createMany({ data: activitiesData });
  console.log(`✅ Seeded ${activitiesData.length} activities.`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
