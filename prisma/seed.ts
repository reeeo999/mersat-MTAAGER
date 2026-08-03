import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء تعبئة البيانات التجريبية...');

  // تنظيف البيانات القديمة
  await prisma.metric.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.task.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.content.deleteMany();
  await prisma.competitorAd.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brandAsset.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.client.deleteMany();
  await prisma.trend.deleteMany();
  await prisma.template.deleteMany();
  await prisma.insight.deleteMany();

  // ==================== عملاء ====================
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'متجر الأناقة الفاخرة',
        email: 'elegance@example.com',
        phone: '+966500000001',
        storeUrl: 'https://elegance.example.com',
        niche: 'أزياء نسائية',
        brandColor: '#D4A574',
        status: 'active',
        readinessScore: 92,
        monthlyBudget: 25000,
        notes: 'عميل مميز - ملتزم بالمواعيد',
      },
    }),
    prisma.client.create({
      data: {
        name: 'ساعة الجود',
        email: 'jood@example.com',
        phone: '+966500000002',
        storeUrl: 'https://jood-watches.example.com',
        niche: 'ساعات فاخرة',
        brandColor: '#0F766E',
        status: 'active',
        readinessScore: 78,
        monthlyBudget: 18000,
      },
    }),
    prisma.client.create({
      data: {
        name: 'عطور الشرق',
        email: 'sharq@example.com',
        phone: '+966500000003',
        storeUrl: 'https://sharq-perfumes.example.com',
        niche: 'عطور',
        brandColor: '#7C3AED',
        status: 'onboarding',
        readinessScore: 45,
        monthlyBudget: 12000,
      },
    }),
    prisma.client.create({
      data: {
        name: 'متجر لياقة',
        email: 'lifestyle@example.com',
        phone: '+966500000004',
        storeUrl: 'https://lifestyle.example.com',
        niche: 'معدات رياضية',
        brandColor: '#10B981',
        status: 'active',
        readinessScore: 88,
        monthlyBudget: 35000,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${clients.length} عملاء`);

  // ==================== أصول براند ====================
  for (const client of clients) {
    await prisma.brandAsset.createMany({
      data: [
        {
          clientId: client.id,
          type: 'logo',
          name: 'logo-primary.png',
          url: `/uploads/logos/${client.id}-primary.png`,
          quality: 'high',
          sizeKb: 245,
        },
        {
          clientId: client.id,
          type: 'image',
          name: 'product-hero.jpg',
          url: `/uploads/products/${client.id}-hero.jpg`,
          quality: client.readinessScore > 80 ? 'high' : 'medium',
          sizeKb: 1200,
        },
      ],
    });
  }

  // ==================== شخصيات ====================
  for (const client of clients) {
    await prisma.persona.create({
      data: {
        clientId: client.id,
        name: 'سارة الذكية',
        ageRange: '25-34',
        gender: 'female',
        location: 'الرياض، جدة، دبي',
        interests: JSON.stringify(['الموضة', 'السفر', 'التسوق الإلكتروني', 'الجمال', 'التصوير']),
        painPoints: JSON.stringify(['صعوبة إيجاد قطع فريدة', 'الأسعار المرتفعة', 'بطء الشحن']),
        aspirations: JSON.stringify(['التميز عن الآخرين', 'مظهر أنيق دائماً', 'ثقة بالنفس']),
        buyingTriggers: JSON.stringify(['عروض محدودة', 'توصية صديقة', 'إعلان جذاب']),
        channels: JSON.stringify(['Instagram', 'TikTok', 'Snapchat', 'Twitter']),
      },
    });
  }

  // ==================== منافسين ====================
  for (const client of clients) {
    const clientNiche = client.niche || 'عام';
    await prisma.competitor.createMany({
      data: [
        {
          clientId: client.id,
          name: `${clientNiche} Pro`,
          url: 'https://competitor1.example.com',
          facebookPage: 'competitor1',
          instagramHandle: '@competitor1',
          strengthScore: 75,
        },
        {
          clientId: client.id,
          name: `Global ${clientNiche}`,
          url: 'https://competitor2.example.com',
          facebookPage: 'competitor2',
          tiktokHandle: '@competitor2',
          strengthScore: 68,
        },
      ],
    });
  }

  // ==================== منتجات ====================
  const productNames: Record<string, string[]> = {
    'أزياء نسائية': ['فستان سهرة مطرز', 'حقيبة جلد طبيعي', 'عباية فاخرة', 'حذاء كعب عالي'],
    'ساعات فاخرة': ['ساعة ذهبية كلاسيك', 'ساعة كرونوغراف', 'ساعة جلد طبيعي', 'ساعة ذكية برو'],
    'عطور': ['عطر الورد الدمشقي', 'عطر العود الملكي', 'عطر المسك الأبيض', 'مجموعة عطور فاخرة'],
    'معدات رياضية': ['دراجة هوائية احترافية', 'أوزان قابلة للتعديل', 'ساعة لياقة', 'حقيبة جيم'],
  };

  for (const client of clients) {
    const nicheKey = client.niche || '';
    const names = productNames[nicheKey] || [];
    for (let i = 0; i < names.length; i++) {
      await prisma.product.create({
        data: {
          clientId: client.id,
          name: names[i],
          sku: `SKU-${client.id.slice(-4)}-${i + 1}`,
          price: 150 + i * 80,
          cost: 60 + i * 30,
          currency: 'SAR',
          stock: 50 - i * 5,
          category: nicheKey,
          status: 'active',
        },
      });
    }
  }

  // ==================== حملات ====================
  const campaignStatuses = ['active', 'active', 'active', 'paused', 'completed'];
  for (const client of clients) {
    const clientNiche = client.niche || 'عام';
    for (let i = 0; i < 3; i++) {
      const campaign = await prisma.campaign.create({
        data: {
          clientId: client.id,
          name: `حملة ${clientNiche} - ${i + 1}`,
          platform: i === 0 ? 'meta' : i === 1 ? 'tiktok' : 'google',
          objective: 'conversion',
          status: campaignStatuses[i],
          dailyBudget: 200 + i * 100,
          totalBudget: 6000 + i * 3000,
          startDate: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000),
        },
      });

      // إضافة إعلانات للحملة
      for (let j = 0; j < 3; j++) {
        const impressions = 50000 + Math.floor(Math.random() * 100000);
        const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.03));
        const spend = 500 + Math.floor(Math.random() * 2000);
        const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.05));
        const revenue = conversions * (80 + Math.random() * 200);
        await prisma.ad.create({
          data: {
            campaignId: campaign.id,
            name: `إعلان ${j + 1} - ${campaign.platform}`,
            format: j === 0 ? 'image' : j === 1 ? 'video' : 'carousel',
            copy: `اكتشف ${clientNiche} بأفضل الأسعار!`,
            cta: 'اطلب الآن',
            status: campaign.status === 'active' ? 'active' : 'paused',
            impressions,
            clicks,
            spend,
            conversions,
            revenue,
            roas: spend > 0 ? revenue / spend : 0,
          },
        });
      }
    }
  }

  // ==================== مقاييس يومية ====================
  for (const client of clients) {
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
      const spend = 300 + Math.random() * 1500;
      const revenue = spend * (2 + Math.random() * 4);
      const impressions = 30000 + Math.floor(Math.random() * 80000);
      const clicks = Math.floor(impressions * 0.02);
      const conversions = Math.floor(clicks * 0.04);
      await prisma.metric.create({
        data: {
          clientId: client.id,
          date,
          platform: 'meta',
          impressions,
          clicks,
          spend,
          conversions,
          revenue,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          cpc: clicks > 0 ? spend / clicks : 0,
          cpa: conversions > 0 ? spend / conversions : 0,
          roas: spend > 0 ? revenue / spend : 0,
        },
      });
    }
  }

  // ==================== محتوى ====================
  for (const client of clients) {
    await prisma.content.createMany({
      data: [
        {
          clientId: client.id,
          type: 'copy',
          platform: 'meta',
          title: 'نسخة إعلان 1',
          body: 'اكتشفي مجموعتنا الجديدة من الأزياء الفاخرة بخصم 30%',
          cta: 'تسوقي الآن',
          status: 'approved',
          aiGenerated: true,
        },
        {
          clientId: client.id,
          type: 'video',
          platform: 'tiktok',
          title: 'فيديو تيك توك قصير',
          body: '15 ثانية توضح المنتج مع عرض سعري',
          cta: 'اطلبي الآن',
          status: 'in_review',
        },
      ],
    });
  }

  // ==================== مهام ====================
  await prisma.task.createMany({
    data: [
      {
        clientId: clients[0].id,
        title: 'تجديد كريتيف حملة الملابس',
        description: 'الإعلانات الحالية حققت Creative Fatigue',
        status: 'pending',
        priority: 'high',
        category: 'creative',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: clients[1].id,
        title: 'تحليل أداء الأسبوع',
        description: 'إعداد تقرير أسبوعي مع توصيات scaling',
        status: 'in_progress',
        priority: 'medium',
        category: 'analytics',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: clients[2].id,
        title: 'استلام أصول البراند',
        description: 'العميل لم يرسل اللوجو والصور بعد',
        status: 'blocked',
        priority: 'high',
        category: 'onboarding',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'مراجعة الفواتير الشهرية',
        status: 'pending',
        priority: 'low',
        category: 'admin',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ==================== رؤى ذكية ====================
  await prisma.insight.createMany({
    data: [
      {
        clientId: clients[0].id,
        type: 'opportunity',
        title: 'فرصة scaling: إعلان الفيديو',
        body: 'إعلان "فستان سهرة مطرز" يحقق ROAS 6.2x. زِد الميزانية اليومية 40%.',
        priority: 'high',
      },
      {
        clientId: clients[1].id,
        type: 'warning',
        title: 'تحذير: Creative Fatigue',
        body: 'إعلان الساعة الذهبية بدأ يفقد أداءه (CTR انخفض 35% في 3 أيام).',
        priority: 'high',
      },
      {
        clientId: clients[3].id,
        type: 'achievement',
        title: '🎉 إنجاز: ROAS تجاوز 5x',
        body: 'حملة المعدات الرياضية حققت ROAS 5.4x هذا الأسبوع. استمر!',
        priority: 'medium',
      },
      {
        type: 'info',
        title: 'ترند: موضة الألوان الترابية',
        body: 'النيش يبحث عن ألوان ترابية هذا الموسم. فرصة لإطلاق كريتيف جديد.',
        priority: 'low',
      },
    ],
  });

  // ==================== ترندات ====================
  await prisma.trend.createMany({
    data: [
      { niche: 'أزياء', platform: 'tiktok', hashtag: '#OOTD', format: 'reel', reach: 4500000, velocity: 85 },
      { niche: 'ساعات', platform: 'meta', hashtag: '#luxury', format: 'carousel', reach: 1200000, velocity: 60 },
      { niche: 'عطور', platform: 'tiktok', sound: 'Aesthetic Sound', format: 'video', reach: 800000, velocity: 90 },
      { niche: 'معدات رياضية', platform: 'meta', hashtag: '#gym', format: 'video', reach: 3200000, velocity: 75 },
    ],
  });

  // ==================== قوالب ====================
  await prisma.template.createMany({
    data: [
      {
        name: 'قالب إعلان منتج - سكرول ستوبير',
        category: 'copy',
        platform: 'meta',
        content: JSON.stringify({
          structure: ['Hook قوي', 'فائدة 1', 'فائدة 2', 'دليل اجتماعي', 'CTA'],
          example: 'توقفي عن البحث...\n✓ جودة استثنائية\n✓ سعر مميز\n⭐ +5000 عميلة سعيدة\nاطلبي الآن',
        }),
      },
      {
        name: 'قالب فيديو تيك توك - 15 ثانية',
        category: 'video',
        platform: 'tiktok',
        content: JSON.stringify({
          structure: ['Hook بصري 0-3ث', 'مشكلة 3-7ث', 'حل 7-12ث', 'CTA 12-15ث'],
        }),
      },
      {
        name: 'قالب صفحة هبوط',
        category: 'landing',
        platform: 'all',
        content: JSON.stringify({
          sections: ['Hero with CTA', 'Benefits', 'Testimonials', 'FAQ', 'Final CTA'],
        }),
      },
    ],
  });

  // ==================== Workflows ====================
  await prisma.workflow.createMany({
    data: [
      {
        name: 'تنبيه عند انخفاض ROAS',
        trigger: 'on_low_roas',
        steps: JSON.stringify([
          { action: 'check_roas', threshold: 2.0 },
          { action: 'notify', channel: 'whatsapp', recipient: 'account_manager' },
          { action: 'create_task', title: 'مراجعة الحملة' },
        ]),
        isActive: true,
      },
      {
        name: 'تقرير أسبوعي تلقائي',
        trigger: 'weekly_monday',
        steps: JSON.stringify([
          { action: 'aggregate_metrics', period: 'last_7_days' },
          { action: 'generate_pdf' },
          { action: 'send_email', recipient: 'client' },
        ]),
        isActive: true,
      },
    ],
  });

  console.log('✅ تم تعبئة جميع البيانات بنجاح');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
