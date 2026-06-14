'use client';

import { useState } from 'react';
import { Item, Category } from '@/types';

const CATEGORIES: Category[] = ['レトロPC', 'PDA', '書籍', '周辺機器', 'その他'];

interface EditModalProps {
  item: Item;
  onSave: (updated: Item) => void;
  onClose: () => void;
}

export default function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<Category>(item.category);
  const [memo, setMemo] = useState(item.memo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, memo }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json() as Item;
      onSave(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="terminal-border-bright p-6 w-full max-w-md" style={{ background: 'var(--bg-panel)' }}>
        <h3 className="text-sm mb-4 glow">
          &gt; EDIT ITEM [{item.id.slice(0, 8)}]
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>NAME:</label>
            <input
              className="input-terminal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>CATEGORY:</label>
            <select
              className="select-terminal w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>MEMO:</label>
            <textarea
              className="input-terminal resize-none"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs mt-2" style={{ color: '#ff4444' }}>ERROR: {error}</p>
        )}

        <div className="flex gap-2 mt-4">
          <button className="btn-terminal primary text-xs" onClick={handleSave} disabled={saving}>
            {saving ? '[ SAVING... ]' : '[ SAVE ]'}
          </button>
          <button className="btn-terminal text-xs" onClick={onClose}>
            [ CANCEL ]
          </button>
        </div>
      </div>
    </div>
  );
}
