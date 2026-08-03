import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { timeAgo, formatDate } from '@/lib/utils';
import { Cog, Zap, AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AutomationPage() {
  const [workflows, tasks, insights] = await Promise.all([
    prisma.workflow.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.task.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.insight.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <>
      <TopBar
        title="🤖 محرك الأتمتة"
        subtitle="Workflows تلقائية + تنبيهات ذكية + مهام"
      />
      <div className="p-8 space-y-6">
        {/* Workflows */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cog className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">Workflows نشطة ({workflows.length})</h2>
            </div>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" />
              Workflow جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workflows.map((w) => {
              let steps: any[] = [];
              try { steps = JSON.parse(w.steps); } catch {}
              return (
                <div key={w.id} className="p-4 rounded-lg bg-ink-900/50 border border-white/5 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-white">{w.name}</div>
                      <div className="text-xs text-ink-200 mt-1">عند: {w.trigger}</div>
                    </div>
                    <span className={`badge ${w.isActive ? 'badge-success' : 'badge-info'}`}>
                      {w.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink-100">
                        <Zap className="w-3 h-3 text-gold-400" />
                        <span>{s.action}</span>
                        {s.threshold && <span className="text-ink-200">({s.threshold})</span>}
                      </div>
                    ))}
                  </div>

                  {w.lastRun && (
                    <div className="text-[10px] text-ink-200 mt-3 pt-2 border-t border-white/5">
                      آخر تشغيل: {timeAgo(w.lastRun)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">المهام ({tasks.length})</h2>
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map((t) => {
              const priorityBadge = {
                high: 'badge-danger',
                medium: 'badge-warning',
                low: 'badge-info',
              }[t.priority] || 'badge-info';
              const statusIcon = {
                pending: Clock,
                in_progress: Zap,
                done: CheckCircle2,
                blocked: AlertCircle,
              }[t.status] || Clock;
              const StatusIcon = statusIcon;
              return (
                <div key={t.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-start gap-3">
                  <StatusIcon className={`w-4 h-4 mt-0.5 ${
                    t.status === 'done' ? 'text-emerald-400' :
                    t.status === 'blocked' ? 'text-rose-400' :
                    t.status === 'in_progress' ? 'text-sky-400' : 'text-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-white">{t.title}</span>
                      <span className={`badge ${priorityBadge}`}>{t.priority}</span>
                      {t.category && <span className="badge badge-teal">{t.category}</span>}
                    </div>
                    {t.description && <p className="text-xs text-ink-100 mb-1">{t.description}</p>}
                    <div className="flex items-center gap-3 text-[10px] text-ink-200 flex-wrap">
                      {t.client && <span>👤 {t.client.name}</span>}
                      {t.dueDate && <span>📅 {formatDate(t.dueDate)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">رؤى ذكية حديثة</h2>
          </div>

          <div className="space-y-2">
            {insights.map((ins) => {
              const typeColor = {
                opportunity: 'border-emerald-500/30 bg-emerald-500/5',
                warning: 'border-amber-500/30 bg-amber-500/5',
                achievement: 'border-sky-500/30 bg-sky-500/5',
                info: 'border-gold-500/30 bg-gold-500/5',
              }[ins.type] || '';
              return (
                <div key={ins.id} className={`p-3 rounded-lg border ${typeColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${
                      ins.priority === 'high' ? 'badge-danger' :
                      ins.priority === 'medium' ? 'badge-warning' : 'badge-info'
                    }`}>{ins.priority}</span>
                    <span className="text-sm font-bold text-white">{ins.title}</span>
                    <span className="text-[10px] text-ink-200 mr-auto">{timeAgo(ins.createdAt)}</span>
                  </div>
                  <p className="text-xs text-ink-100">{ins.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
