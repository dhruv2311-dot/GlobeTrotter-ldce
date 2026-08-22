import { ExpenseCategory, PrismaClient, Role, Visibility } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

async function main() {
  console.log('Starting GlobeTrotter database seed...');

  // Clear dependent records first so the seed can be rerun safely.
  await prisma.communityPost.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.tripDay.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.tripShare.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.country.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  await prisma.systemConfig.createMany({
    data: [
      { key: 'APP_NAME', value: 'GlobeTrotter' },
      { key: 'VERSION', value: '1.0.0' },
      { key: 'MAINTENANCE_MODE', value: 'false' },
    ],
  });

  const [demoPassword, adminPassword] = await Promise.all([
    bcrypt.hash('Demo@123456', 10),
    bcrypt.hash('AdminSecret99!', 10),
  ]);

  const demo = await prisma.user.create({
    data: {
      firstName: 'Alex', lastName: 'Morgan', username: 'alexmorgan',
      email: 'demo@globetrotter.com', passwordHash: demoPassword,
      phone: '+91 98765 43210', city: 'Ahmedabad', country: 'India',
      bio: 'Travel planner building thoughtful, city-to-city adventures.',
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      role: Role.USER, isEmailVerified: true,
      preference: { create: { language: 'en' } },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'Admin', lastName: 'GlobeTrotter', username: 'admin',
      email: 'admin@globetrotter.com', passwordHash: adminPassword,
      city: 'Paris', country: 'France', bio: 'GlobeTrotter platform administrator.',
      role: Role.ADMIN, isEmailVerified: true,
      preference: { create: { language: 'en' } },
    },
  });

  const countryData = [
    ['India', 'IN'], ['France', 'FR'], ['Italy', 'IT'], ['Spain', 'ES'],
    ['Japan', 'JP'], ['United Kingdom', 'GB'], ['United States', 'US'], ['Thailand', 'TH'],
  ];
  const countries = new Map<string, number>();
  for (const [name, code] of countryData) {
    const country = await prisma.country.create({ data: { name, code } });
    countries.set(name, country.id);
  }

  const cityData = [
    ['Ahmedabad', 'India', 'Asia', 2, 4.2, 'A heritage city known for architecture, textiles, and exceptional street food.', 'https://images.unsplash.com/photo-1605649487212-47bdab064df7'],
    ['Mumbai', 'India', 'Asia', 3, 4.5, 'A lively coastal city blending cinema, markets, history, and modern culture.', 'https://images.unsplash.com/photo-1566552881560-0be862a7c445'],
    ['Paris', 'France', 'Europe', 5, 4.9, 'The city of light, art, fashion, and memorable food along the Seine.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'],
    ['Rome', 'Italy', 'Europe', 4, 4.8, 'An open-air museum of ancient history, piazzas, and Italian cuisine.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'],
    ['Barcelona', 'Spain', 'Europe', 4, 4.8, 'A Mediterranean city of Gaudi architecture, beaches, and late-night dining.', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4'],
    ['Tokyo', 'Japan', 'Asia', 4, 4.9, 'A fast-moving metropolis where historic temples meet inventive city life.', 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7'],
    ['London', 'United Kingdom', 'Europe', 5, 4.7, 'A global capital filled with museums, theatre, royal history, and neighborhoods.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'],
    ['New York', 'United States', 'North America', 5, 4.8, 'An energetic city of iconic parks, galleries, food, and skyline views.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9'],
    ['Bangkok', 'Thailand', 'Asia', 2, 4.6, 'A colorful gateway to temples, markets, river life, and Thai cuisine.', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365'],
    ['Delhi', 'India', 'Asia', 3, 4.4, 'India’s capital, rich with monumental history, galleries, and street food.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5'],
  ] as const;
  const cities = new Map<string, number>();
  const cityImages = new Map<string, string>();
  for (const [name, country, region, costIndex, popularityScore, description, image] of cityData) {
    const city = await prisma.city.create({ data: { name, countryId: countries.get(country)!, region, costIndex, popularityScore, description, image } });
    cities.set(name, city.id);
    cityImages.set(name, image);
  }

  const activityCatalog = [
    ['Paris', 'Louvre Museum Tour', 'Explore the Mona Lisa and the world’s finest art collection.', 'culture', 2500, 180],
    ['Paris', 'Seine River Cruise', 'See Paris landmarks from the water during a relaxed river cruise.', 'leisure', 1500, 60],
    ['Paris', 'Eiffel Tower Visit', 'Take in sweeping views across the city from the iconic tower.', 'sightseeing', 3500, 120],
    ['Rome', 'Colosseum and Roman Forum', 'Walk through the heart of ancient Roman history with a local guide.', 'history', 3000, 180],
    ['Rome', 'Pasta Making Workshop', 'Learn classic Roman recipes and enjoy the meal you prepare.', 'food', 2200, 150],
    ['Barcelona', 'Sagrada Familia Tour', 'Discover Gaudi’s masterpiece with an expert city guide.', 'culture', 2800, 120],
    ['Barcelona', 'Gothic Quarter Food Walk', 'Taste local specialties while exploring historic Barcelona streets.', 'food', 1900, 150],
    ['Tokyo', 'Shinjuku Food Tour', 'Sample ramen, yakitori, and sweets in Tokyo’s lively night lanes.', 'food', 4500, 150],
    ['Tokyo', 'Mount Fuji Day Trip', 'Travel to Lake Kawaguchi and enjoy views of Mount Fuji.', 'nature', 7500, 600],
    ['London', 'Tower of London Tour', 'Explore the Crown Jewels and the city’s medieval fortress.', 'history', 2800, 150],
    ['New York', 'Statue of Liberty Ferry', 'Visit Liberty Island and learn the story of New York harbor.', 'sightseeing', 2200, 240],
    ['Bangkok', 'Floating Market Morning', 'Experience local food and river commerce at a colorful market.', 'culture', 1200, 240],
    ['Ahmedabad', 'Manek Chowk Food Walk', 'Taste Gujarati favorites in the city’s famous evening food market.', 'food', 500, 120],
    ['Delhi', 'Old Delhi Heritage Walk', 'Explore historic lanes, mosques, bazaars, and iconic street food.', 'history', 900, 180],
  ] as const;
  const activities = new Map<string, number>();
  for (const [city, name, description, type, estimatedCost, durationMinutes] of activityCatalog) {
    const activity = await prisma.activity.create({ data: { cityId: cities.get(city)!, name, description, type, estimatedCost, durationMinutes, image: cityImages.get(city) } });
    activities.set(`${city}:${name}`, activity.id);
  }

  const trip = await prisma.trip.create({
    data: {
      userId: demo.id, name: 'European Summer Escape',
      description: 'A carefully paced summer journey through art, food, and iconic European neighborhoods.',
      coverPhoto: cityImages.get('Paris'), startDate: date('2026-09-12'), endDate: date('2026-09-25'),
      visibility: Visibility.PUBLIC, budgetAmount: 90000, budgetCurrency: 'INR',
    },
  });
  await prisma.tripShare.create({ data: { tripId: trip.id, shareSlug: 'european-summer-escape' } });

  const stops = new Map<string, number>();
  for (const stop of [
    ['Paris', '2026-09-12', '2026-09-16', 1],
    ['Rome', '2026-09-17', '2026-09-20', 2],
    ['Barcelona', '2026-09-21', '2026-09-25', 3],
  ] as const) {
    const created = await prisma.tripStop.create({ data: { tripId: trip.id, cityId: cities.get(stop[0])!, startDate: date(stop[1]), endDate: date(stop[2]), order: stop[3] } });
    stops.set(stop[0], created.id);
  }

  const sequenceByDay = new Map<string, number>();
  for (const [dayDate, title, city, activityName, startTime, endTime] of [
    ['2026-09-12', 'Arrive in Paris', 'Paris', 'Eiffel Tower Visit', '10:00', '12:00'],
    ['2026-09-13', 'Art and the Seine', 'Paris', 'Louvre Museum Tour', '10:00', '13:00'],
    ['2026-09-13', 'Evening on the river', 'Paris', 'Seine River Cruise', '17:30', '18:30'],
    ['2026-09-17', 'Ancient Rome', 'Rome', 'Colosseum and Roman Forum', '10:00', '13:00'],
    ['2026-09-18', 'Roman kitchen', 'Rome', 'Pasta Making Workshop', '17:30', '20:00'],
    ['2026-09-21', 'Gaudi and the city', 'Barcelona', 'Sagrada Familia Tour', '10:00', '12:00'],
    ['2026-09-22', 'Taste Barcelona', 'Barcelona', 'Gothic Quarter Food Walk', '17:30', '20:00'],
  ] as const) {
    const day = await prisma.tripDay.upsert({
      where: { tripId_date: { tripId: trip.id, date: date(dayDate) } },
      update: { title }, create: { tripId: trip.id, date: date(dayDate), title },
    });
    const sequence = (sequenceByDay.get(dayDate) || 0) + 1;
    sequenceByDay.set(dayDate, sequence);
    await prisma.tripActivity.create({ data: { tripDayId: day.id, activityId: activities.get(`${city}:${activityName}`)!, startTime, endTime, sequence } });
  }

  await prisma.tripExpense.createMany({
    data: [
      { tripId: trip.id, tripStopId: stops.get('Paris'), category: ExpenseCategory.STAY, amount: 26000, currency: 'INR', date: date('2026-09-12'), description: 'Paris accommodation' },
      { tripId: trip.id, tripStopId: stops.get('Rome'), category: ExpenseCategory.TRANSPORT, amount: 12500, currency: 'INR', date: date('2026-09-17'), description: 'Intercity rail and airport transfers' },
      { tripId: trip.id, tripStopId: stops.get('Paris'), category: ExpenseCategory.ACTIVITY, amount: 7500, currency: 'INR', date: date('2026-09-13'), description: 'Paris experiences' },
      { tripId: trip.id, tripStopId: stops.get('Rome'), category: ExpenseCategory.MEAL, amount: 6800, currency: 'INR', date: date('2026-09-18'), description: 'Meals and food tours' },
    ],
  });

  const ongoingTrip = await prisma.trip.create({ data: { userId: demo.id, name: 'Japan City Lights', description: 'A live trip through Tokyo and Bangkok with food, temples, and neighborhood walks.', coverPhoto: cityImages.get('Tokyo'), startDate: date('2026-08-18'), endDate: date('2026-08-28'), visibility: Visibility.PRIVATE, budgetAmount: 110000, budgetCurrency: 'INR' } });
  await prisma.tripStop.createMany({ data: [{ tripId: ongoingTrip.id, cityId: cities.get('Tokyo')!, startDate: date('2026-08-18'), endDate: date('2026-08-23'), order: 1 }, { tripId: ongoingTrip.id, cityId: cities.get('Bangkok')!, startDate: date('2026-08-24'), endDate: date('2026-08-28'), order: 2 }] });

  const completedTrip = await prisma.trip.create({ data: { userId: demo.id, name: 'Golden Triangle Weekend', description: 'A completed heritage and food weekend across North India.', coverPhoto: cityImages.get('Delhi'), startDate: date('2026-07-05'), endDate: date('2026-07-12'), visibility: Visibility.PUBLIC, budgetAmount: 42000, budgetCurrency: 'INR' } });
  await prisma.tripStop.createMany({ data: [{ tripId: completedTrip.id, cityId: cities.get('Delhi')!, startDate: date('2026-07-05'), endDate: date('2026-07-08'), order: 1 }, { tripId: completedTrip.id, cityId: cities.get('Mumbai')!, startDate: date('2026-07-09'), endDate: date('2026-07-12'), order: 2 }] });

  await prisma.savedDestination.createMany({ data: [{ userId: demo.id, cityId: cities.get('Tokyo')! }, { userId: demo.id, cityId: cities.get('London')! }, { userId: demo.id, cityId: cities.get('Barcelona')! }] });
  await prisma.communityPost.createMany({
    data: [
      { userId: demo.id, tripId: trip.id, title: 'European Summer Escape', content: 'Paris, Rome, and Barcelona in 14 days with an art-first itinerary and room for long dinners.', image: cityImages.get('Paris') },
      { userId: demo.id, tripId: completedTrip.id, title: 'Golden Triangle Weekend', content: 'A practical heritage route with local food stops and flexible city time.', image: cityImages.get('Delhi') },
    ],
  });

  console.log(`Seeded ${countries.size} countries, ${cities.size} cities, ${activityCatalog.length} activities, and 3 trips.`);
  console.log('Demo login: demo@globetrotter.com / Demo@123456');
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
