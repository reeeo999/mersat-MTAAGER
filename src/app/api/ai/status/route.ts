import { NextResponse } from 'next/server';
import { checkAIAvailability } from '@/lib/ai';

export async function GET() {
  const status = await checkAIAvailability();
  return NextResponse.json(status);
}
