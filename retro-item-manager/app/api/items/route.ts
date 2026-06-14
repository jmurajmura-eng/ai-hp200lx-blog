import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readItems, addItem } from '@/lib/items';
import { Item } from '@/types';

export async function GET() {
  try {
    const items = readItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/items error:', error);
    return NextResponse.json({ error: 'Failed to read items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const item: Item = {
      id: uuidv4(),
      name: body.name,
      category: body.category,
      memo: body.memo ?? '',
      createdAt: now,
      updatedAt: now,
    };
    const saved = addItem(item);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}
