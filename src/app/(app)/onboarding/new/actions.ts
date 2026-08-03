'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string;
  storeUrl?: string;
  niche?: string;
  brandColor?: string;
  monthlyBudget?: number;
  notes?: string;
}) {
  // حساب درجة الجاهزية بناء على البيانات المقدّمة
  let score = 30; // نقطة بداية
  if (data.email) score += 10;
  if (data.phone) score += 10;
  if (data.storeUrl) score += 15;
  if (data.niche) score += 10;
  if (data.brandColor) score += 5;
  if (data.monthlyBudget) score += 10;
  if (data.notes) score += 10;
  score = Math.min(score, 100);

  const client = await prisma.client.create({
    data: {
      ...data,
      monthlyBudget: data.monthlyBudget || null,
      readinessScore: score,
      status: 'onboarding',
    },
  });

  // إنشاء مهام افتراضية للـ onboarding
  const defaultTasks = [
    { title: 'استلام أصول البراند (لوجو، ألوان، صور)', category: 'onboarding', priority: 'high' },
    { title: 'ربط حسابات الإعلانات (BM + Pixel)', category: 'onboarding', priority: 'high' },
    { title: 'توقيع العقد الإلكتروني', category: 'onboarding', priority: 'high' },
    { title: 'تحليل المنافسين', category: 'onboarding', priority: 'medium' },
    { title: 'بناء Persona', category: 'onboarding', priority: 'medium' },
    { title: 'إعداد المتجر التقني', category: 'onboarding', priority: 'medium' },
    { title: 'إنتاج أول كريتيف', category: 'onboarding', priority: 'low' },
  ];

  for (const task of defaultTasks) {
    await prisma.task.create({
      data: {
        ...task,
        clientId: client.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  revalidatePath('/onboarding');
  revalidatePath('/');
  redirect(`/onboarding/${client.id}`);
}
