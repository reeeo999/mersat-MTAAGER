import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { checkAIAvailability } from '@/lib/ai';
import CreativeStudio from './CreativeStudio';

export const dynamic = 'force-dynamic';

export default async function CreativePage() {
  const [contents, clients, templates, aiStatus] = await Promise.all([
    prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.template.findMany(),
    checkAIAvailability(),
  ]);

  return (
    <>
      <TopBar
        title="🎨 استوديو الإبداع الموحد"
        subtitle="توليد Copy ذكي، إدارة الكريتيف، مكتبة قوالب"
      />
      <div className="p-8">
        <CreativeStudio
          contents={contents.map(c => ({
            id: c.id,
            title: c.title,
            body: c.body,
            type: c.type,
            platform: c.platform,
            status: c.status,
            clientName: c.client.name,
            aiGenerated: c.aiGenerated,
            createdAt: c.createdAt.toISOString(),
          }))}
          clients={clients.map(c => ({ id: c.id, name: c.name, niche: c.niche }))}
          templates={templates.map(t => ({ id: t.id, name: t.name, category: t.category, platform: t.platform }))}
          aiStatus={aiStatus}
        />
      </div>
    </>
  );
}
