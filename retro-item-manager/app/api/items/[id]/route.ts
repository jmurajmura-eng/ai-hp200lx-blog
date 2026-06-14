import { NextRequest, NextResponse } from 'next/server';
import { updateItem, deleteItem } from '@/lib/items';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateItem(id, {
      name: body.name,
      category: body.category,
      memo: body.memo,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/items/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteItem(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/items/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
