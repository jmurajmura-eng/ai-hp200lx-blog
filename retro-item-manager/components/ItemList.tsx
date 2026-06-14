'use client';

import { useState } from 'react';
import { Item, Category } from '@/types';
import EditModal from './EditModal';

const CATEGORIES: Category[] = ['レトロPC', 'PDA', '書籍', '周辺機器', 'その他'];

interface ItemListProps {
  items: Item[];
  onUpdate: (updated: Item) => void;
  onDelete: (id: string) => void;
}

export default function ItemList({ items, onUpdate, onDelete }: ItemListProps) {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const matchCat = filter === 'ALL' || item.category === filter;
    const matchSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.memo.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (deletingId === id) {
      try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        onDelete(id);
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId((cur) => (cur === id ? null : cur)), 3000);
    }
  };

  return (
    <div className="terminal-border p-4">
      <h2 className="text-sm mb-4 glow">
        &gt; ITEM DATABASE [{items.length} RECORDS]
      </h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="input-terminal text-xs flex-1"
          placeholder="SEARCH..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1">
          <button
            className={`category-badge cursor-pointer text-xs ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            ALL
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-badge cursor-pointer text-xs ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      {filtered.length > 0 && (
        <div
          className="grid text-xs mb-1 px-2 py-1"
          style={{
            gridTemplateColumns: '1fr auto auto auto',
            gap: '0.5rem',
            color: 'var(--green-dim)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>NAME / MEMO</span>
          <span>CATEGORY</span>
          <span>DATE</span>
          <span>OPS</span>
        </div>
      )}

      {/* Items */}
      {filtered.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--green-dim)' }}>
          {items.length === 0 ? '-- NO ITEMS REGISTERED --' : '-- NO MATCHING ITEMS --'}
        </p>
      ) : (
        <div className="space-y-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="grid text-xs px-2 py-2 hover:bg-green-950/10 transition-colors"
              style={{
                gridTemplateColumns: '1fr auto auto auto',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border)',
                alignItems: 'start',
              }}
            >
              <div>
                <span className="glow-dim">{item.name}</span>
                {item.memo && (
                  <span className="block mt-0.5 text-xs" style={{ color: 'var(--green-dim)', opacity: 0.7 }}>
                    {item.memo}
                  </span>
                )}
              </div>
              <span className="category-badge" style={{ whiteSpace: 'nowrap', marginTop: '2px' }}>
                {item.category}
              </span>
              <span style={{ color: 'var(--green-dim)', whiteSpace: 'nowrap', marginTop: '2px' }}>
                {item.createdAt.slice(0, 10)}
              </span>
              <div className="flex gap-1" style={{ marginTop: '1px' }}>
                <button
                  className="btn-terminal text-xs"
                  style={{ padding: '0.1rem 0.4rem' }}
                  onClick={() => setEditingItem(item)}
                >
                  [E]
                </button>
                <button
                  className={`btn-terminal danger text-xs ${deletingId === item.id ? 'blink' : ''}`}
                  style={{ padding: '0.1rem 0.4rem' }}
                  onClick={() => handleDelete(item.id)}
                  title={deletingId === item.id ? 'Click again to confirm delete' : 'Delete'}
                >
                  {deletingId === item.id ? '[!!]' : '[D]'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={(updated) => {
            onUpdate(updated);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
