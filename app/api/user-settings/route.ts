import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        currency: 'USD',
        userId: user.id,
      },
    });
  }

  // Revalidate the home page that uses the currency
  revalidatePath('/');
  return Response.json(userSettings);
}
