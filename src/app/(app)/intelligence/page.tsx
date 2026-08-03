import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { generateAI, AI_PROMPTS, checkAIAvailability } from '@/lib/ai';
import IntelligenceClient from './IntelligenceClient';

export const dynamic = 'force-dynamic';

export default async function IntelligencePage() {
  const [clients, trends, personas, aiStatus] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.trend.findMany({ orderBy: { reach: 'desc' }, take: 20 }),
    prisma.persona.findMany({ include: { client: true } }),
    checkAIAvailability(),
  ]);

  return (
    <>
      <TopBar
        title="🔬 مختبر الاستخبارات"
        subtitle="تحليل المنافسين، بناء الشخصيات، ورصد الترندات بالذكاء الاصطناعي"
      />
      <div className="p-8">
        <IntelligenceClient
          clients={clients.map(c => ({ id: c.id, name: c.name, niche: c.niche }))}
          trends={trends.map(t => ({
            id: t.id,
            niche: t.niche,
            platform: t.platform,
            hashtag: t.hashtag,
            sound: t.sound,
            format: t.format,
            reach: t.reach,
            velocity: t.velocity,
          }))}
          personas={personas.map(p => ({
            id: p.id,
            clientName: p.client.name,
            name: p.name,
            ageRange: p.ageRange,
            location: p.location,
          }))}
          aiStatus={aiStatus}
        />
      </div>
    </>
  );
}
