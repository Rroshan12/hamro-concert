import { sql,  } from 'drizzle-orm';

/**
 * Standard interface for paginated results.
 * @template T The type of the data elements.
 */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginate function for Drizzle select queries.
 * * NOTE: The provided Drizzle query object must be a *fully constructed* select query
 * (including .from and any .where clauses) but WITHOUT .limit() or .offset().
 * * @param db The Drizzle database instance.
 * @param query The Drizzle select query builder (e.g., db.select().from(users).where(...)).
 * @param table The base Drizzle table object (e.g., users).
 * @param page The current page number (default 1).
 * @param limit The number of items per page (default 10).
 * @template T The type of the entity being queried (e.g., User).
 * @returns A promise resolving to the paginated result.
 */
export async function paginate<T>(
  db: any,
  query: any,
  table: any,
  page = 2,
  limit = 10,
): Promise<PaginatedResult<T>> {
  const offset = (page - 1) * limit;

  // 1. Correctly get the total count using the `sql` function
  // We run a separate query specifically for the count.
  const totalResult = await db.select({ count: sql<number>`COUNT(*)` }).from(table);
  const total = Number(totalResult[0].count);
  const data = await query.limit(Number(limit)).offset(Number(offset));

  return {
    data: data as T[],
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}