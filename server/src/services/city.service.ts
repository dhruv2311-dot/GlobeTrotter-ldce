import { City, Country, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { NotFoundError } from '../errors/AppError';
import { PaginatedResult } from '../types';

export interface ListCitiesQuery {
  search?: string;
  countryId?: number;
  region?: string;
  sort?: 'popularity' | 'name' | 'cost_asc' | 'cost_desc';
  page: number;
  limit: number;
}

export type CityWithCountry = City & {
  country: Country;
};

export async function listCities(query: ListCitiesQuery): Promise<PaginatedResult<CityWithCountry>> {
  const { search, countryId, region, sort, page, limit } = query;

  // Build where filters
  const where: Prisma.CityWhereInput = {};

  if (countryId !== undefined) {
    where.countryId = countryId;
  }

  if (region) {
    where.region = {
      equals: region,
      mode: 'insensitive',
    };
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        region: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        country: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  // Build ordering
  let orderBy: Prisma.CityOrderByWithRelationInput = { popularityScore: 'desc' };

  if (sort === 'name') {
    orderBy = { name: 'asc' };
  } else if (sort === 'popularity') {
    orderBy = { popularityScore: 'desc' };
  } else if (sort === 'cost_asc') {
    orderBy = { costIndex: 'asc' };
  } else if (sort === 'cost_desc') {
    orderBy = { costIndex: 'desc' };
  }

  // Pagination logic
  const skip = (page - 1) * limit;
  const take = limit;

  // Execute transaction for count and data to avoid query drift
  const [total, items] = await prisma.$transaction([
    prisma.city.count({ where }),
    prisma.city.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        country: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getCityById(id: number): Promise<CityWithCountry> {
  const city = await prisma.city.findUnique({
    where: { id },
    include: {
      country: true,
    },
  });

  if (!city) {
    throw new NotFoundError(`City with ID ${id} not found`);
  }

  return city;
}
