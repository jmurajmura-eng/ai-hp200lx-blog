import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readItems } from '@/lib/items';
import { NoteIdea } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST() {
  try {
    const items = readItems();

    if (items.length === 0) {
      return NextResponse.json({ error: 'No items registered' }, { status: 400 });
    }

    const itemList = items
      .map((item) => `- ${item.name}（${item.category}）${item.memo ? `: ${item.memo}` : ''}`)
      .join('\n');

    const prompt = `以下は私が所有しているレトロコンピュータ・ガジェット・書籍のリストです：

${itemList}

これらのアイテムを組み合わせたり、それぞれにフォーカスしたりして、note（日本のブログプラットフォーム）に投稿する記事アイデアを5件提案してください。

レトロコンピュータやPDA愛好家向けの、実用的・懐古的・技術的な記事が好まれます。

JSON配列で返してください（説明文不要）：
[{"title": "記事タイトル案", "description": "一行説明（50文字以内）"}]`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from API');
    }

    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    const ideas = JSON.parse(jsonMatch[0]) as NoteIdea[];
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('POST /api/generate-ideas error:', error);
    return NextResponse.json({ error: 'Idea generation failed' }, { status: 500 });
  }
}
