import { Activity, City, Country, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { NotFoundError } from '../errors/AppError';
import { PaginatedResult } from '../types';

export interface ListActivitiesQuery {
  search?: string;
  cityId?: number;
  type?: string;
  minCost?: number;
  maxCost?: number;
  maxDuration?: number;
  sort?: 'name' | 'cost_asc' | 'cost_desc' | 'duration_asc' | 'duration_desc';
  page: number;
  limit: number;
}

export type ActivityWithCityAndCountry = Activity & {
  city: City & {
    country: Country;
  };
};

export async function listActivities(
  query: ListActivitiesQuery
): Promise<PaginatedResult<ActivityWithCityAndCountry>> {
  const { search, cityId, type, minCost, maxCost, maxDuration, sort, page, limit } = query;

  // Build where filters
  const where: Prisma.ActivityWhereInput = {};

  if (cityId !== undefined) {
    where.cityId = cityId;
  }

  if (type) {
    where.type = {
      equals: type,
      mode: 'insensitive',
    };
  }

  // Cost range filters
  if (minCost !== undefined || maxCost !== undefined) {
    where.estimatedCost = {};
    if (minCost !== undefined) {
      where.estimatedCost.gte = minCost;
    }
    if (maxCost !== undefined) {
      where.estimatedCost.lte = maxCost;
    }
  }

  if (maxDuration !== undefined) {
    where.durationMinutes = {
      lte: maxDuration,
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
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Build ordering
  let orderBy: Prisma.ActivityOrderByWithRelationInput = { name: 'asc' };

  if (sort === 'name') {
    orderBy = { name: 'asc' };
  } else if (sort === 'cost_asc') {
    orderBy = { estimatedCost: 'asc' };
  } else if (sort === 'cost_desc') {
    orderBy = { estimatedCost: 'desc' };
  } else if (sort === 'duration_asc') {
    orderBy = { durationMinutes: 'asc' };
  } else if (sort === 'duration_desc') {
    orderBy = { durationMinutes: 'desc' };
  }

  // Pagination logic
  const skip = (page - 1) * limit;
  const take = limit;

  // Transaction for safe count and query fetch
  const [total, items] = await prisma.$transaction([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        city: {
          include: {
            country: true,
          },
        },
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

export async function getActivityById(id: number): Promise<ActivityWithCityAndCountry> {
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      city: {
        include: {
          country: true,
        },
      },
    },
  });

  if (!activity) {
    throw new NotFoundError(`Activity with ID ${id} not found`);
  }

  return activity;
}
