import prisma from '@/lib/prisma';
import { Period, TimeFrame } from '@/lib/types';
import { HistoryDataQuerySchema } from '@/schema/history';
import { currentUser } from '@clerk/nextjs/server';
import { getDaysInMonth } from 'date-fns';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(req.url);
  const timeFrame = searchParams.get('timeFrame');
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  const queryParams = HistoryDataQuerySchema.safeParse({
    timeFrame,
    month,
    year,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;

async function getHistoryData(userId: string, timeFrame: TimeFrame, period: Period) {
  switch (timeFrame) {
    case 'year':
      return await getYearHistoryData(userId, period.year);
    case 'month':
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: 'asc',
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  return history;
}

async function getMonthHistoryData(userId: string, year: number, month: number) {
  const result = await prisma.monthHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: 'asc',
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      year,
      month,
      expense,
      income,
      day: i,
    });
  }

  return history;
}
