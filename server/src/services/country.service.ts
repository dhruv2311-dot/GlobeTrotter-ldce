import { Country } from '@prisma/client';
import prisma from '../config/database';
import { NotFoundError } from '../errors/AppError';

export async function listCountries(): Promise<Country[]> {
  return prisma.country.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getCountryById(id: number): Promise<Country> {
  const country = await prisma.country.findUnique({
    where: { id },
  });

  if (!country) {
    throw new NotFoundError(`Country with ID ${id} not found`);
  }

  return country;
}
