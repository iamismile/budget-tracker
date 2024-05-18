import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(req.url);
  const paramType = searchParams.get('type');

  const validator = z.enum(['expense', 'income']).nullable();
  const queryParam = validator.safeParse(paramType);
  if (!queryParam.success) {
    return Response.json(queryParam.error, {
      status: 400,
    });
  }

  const type = queryParam.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filter if its defined
    },
    orderBy: {
      name: 'asc',
    },
  });
  return Response.json(categories);
}
