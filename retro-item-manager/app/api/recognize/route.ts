import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { RecognizedItem, Category } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORIES: Category[] = ['レトロPC', 'PDA', '書籍', '周辺機器', 'その他'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body as { images: string[] };

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const imageContents = images.map((base64: string) => {
      const match = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) throw new Error('Invalid image format');
      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: match[2],
        },
      };
    });

    const prompt = `以下の画像を分析して、写っている機器・書籍・アイテムをすべてリストアップしてください。

各アイテムについて以下の情報をJSON配列で返してください：
- name: アイテム名（具体的に、例: "HP 200LX", "Sharp Zaurus SL-C3000"）
- category: 以下のいずれか → "レトロPC", "PDA", "書籍", "周辺機器", "その他"
- memo: 状態・特記事項（見た目の状態、付属品など。不明な場合は空文字）

返答はJSONのみ。説明文不要。形式:
[{"name": "...", "category": "...", "memo": "..."}]`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from API');
    }

    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    const recognized = JSON.parse(jsonMatch[0]) as RecognizedItem[];

    const validated = recognized.map((item) => ({
      name: item.name ?? 'Unknown',
      category: CATEGORIES.includes(item.category) ? item.category : 'その他' as Category,
      memo: item.memo ?? '',
    }));

    return NextResponse.json(validated);
  } catch (error) {
    console.error('POST /api/recognize error:', error);
    return NextResponse.json({ error: 'Recognition failed' }, { status: 500 });
  }
}
