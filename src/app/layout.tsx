import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مِرسَاة | منصة تشغيل وكالات التسويق',
  description: 'منصة موحّدة بالذكاء الاصطناعي لإدارة عملاء الوكالة من Onboarding إلى المبيعات الكبيرة. مجانية 100%.',
  keywords: ['تسويق', 'وكالة', 'ذكاء اصطناعي', 'Meta Ads', 'TikTok', 'تحليلات'],
  authors: [{ name: 'MERSAT Team' }],
  openGraph: {
    title: 'مِرسَاة - منصة الوكالة الذكية',
    description: 'من استلام العميل إلى مبيعات كبيرة في 7 أيام فقط',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
