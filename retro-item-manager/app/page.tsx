'use client';

import { useEffect, useState } from 'react';
import { Item } from '@/types';
import UploadSection from '@/components/UploadSection';
import ItemList from '@/components/ItemList';
import IdeaGenerator from '@/components/IdeaGenerator';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'ideas'>('upload');

  useEffect(() => {
    fetch('/api/items')
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleItemsAdded = (newItems: Item[]) => {
    setItems((prev) => [...prev, ...newItems]);
    setActiveTab('list');
  };

  const handleUpdate = (updated: Item) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <header className="mb-8">
        <div className="terminal-border-bright p-4 text-center">
          <pre className="text-xs leading-tight glow" style={{ display: 'inline-block', textAlign: 'left' }}>
{`╔══════════════════════════════════════╗
║   RETRO ITEM MANAGER  v1.0           ║
║   レトロガジェット アイテム管理       ║
╚══════════════════════════════════════╝`}
          </pre>
          <p className="text-xs mt-2" style={{ color: 'var(--green-dim)' }}>
            {loading ? 'LOADING...' : `TOTAL: ${items.length} ITEMS IN DATABASE`}
            <span className="cursor ml-1" />
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="flex gap-0 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {(
          [
            { key: 'upload', label: '[ 01: UPLOAD ]' },
            { key: 'list', label: `[ 02: LIST (${items.length}) ]` },
            { key: 'ideas', label: '[ 03: NOTE IDEAS ]' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            className="text-xs px-4 py-2 transition-all"
            style={{
              background: activeTab === key ? 'rgba(51,255,51,0.1)' : 'transparent',
              color: activeTab === key ? 'var(--green-bright)' : 'var(--green-dim)',
              borderBottom: activeTab === key ? '2px solid var(--green)' : '2px solid transparent',
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      {loading ? (
        <div className="text-xs" style={{ color: 'var(--green-dim)' }}>
          &gt; LOADING DATABASE...
          <span className="blink ml-1">_</span>
        </div>
      ) : (
        <>
          {activeTab === 'upload' && (
            <UploadSection onItemsAdded={handleItemsAdded} />
          )}
          {activeTab === 'list' && (
            <ItemList items={items} onUpdate={handleUpdate} onDelete={handleDelete} />
          )}
          {activeTab === 'ideas' && (
            <IdeaGenerator itemCount={items.length} />
          )}
        </>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-xs" style={{ color: 'var(--green-dim)', opacity: 0.4 }}>
          &gt; RETRO ITEM MANAGER — POWERED BY CLAUDE AI
        </p>
      </footer>
    </div>
  );
}
