import { NextRequest, NextResponse } from 'next/server';
import { generateAI, AI_PROMPTS } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, input } = body as { type: string; input: any };

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'adCopy': {
        const p = AI_PROMPTS.adCopy(input.product, input.audience, input.platform, input.tone);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      case 'persona': {
        const p = AI_PROMPTS.persona(input.product, input.niche);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      case 'competitor': {
        const p = AI_PROMPTS.competitorAnalysis(input.competitor, input.niche);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      case 'swot': {
        const p = AI_PROMPTS.swot(input.product, input.market);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      case 'trends': {
        const p = AI_PROMPTS.trends(input.niche, input.platform);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      case 'policy': {
        const p = AI_PROMPTS.policyCheck(input.copy, input.platform);
        systemPrompt = p.system;
        userPrompt = p.user;
        break;
      }
      default:
        return NextResponse.json({ error: 'نوع غير معروف' }, { status: 400 });
    }

    const result = await generateAI(systemPrompt, userPrompt);
    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
