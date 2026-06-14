'use client';

import { useState, useRef, useCallback } from 'react';
import { RecognizedItem, Category, Item } from '@/types';

const CATEGORIES: Category[] = ['レトロPC', 'PDA', '書籍', '周辺機器', 'その他'];

interface RecognizedItemEditable extends RecognizedItem {
  _key: string;
  selected: boolean;
}

interface UploadSectionProps {
  onItemsAdded: (items: Item[]) => void;
}

export default function UploadSection({ onItemsAdded }: UploadSectionProps) {
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState<RecognizedItemEditable[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => [...prev, result]);
        setPreviews((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecognize = async () => {
    if (images.length === 0) return;
    setRecognizing(true);
    setError(null);
    try {
      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      if (!res.ok) throw new Error('Recognition API failed');
      const data = (await res.json()) as RecognizedItem[];
      setRecognized(
        data.map((item, i) => ({
          ...item,
          _key: `rec-${Date.now()}-${i}`,
          selected: true,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recognition failed');
    } finally {
      setRecognizing(false);
    }
  };

  const handleSave = async () => {
    const toSave = recognized.filter((r) => r.selected);
    if (toSave.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const saved: Item[] = [];
      for (const item of toSave) {
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: item.name, category: item.category, memo: item.memo }),
        });
        if (!res.ok) throw new Error('Save failed');
        saved.push(await res.json());
      }
      onItemsAdded(saved);
      setImages([]);
      setPreviews([]);
      setRecognized([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateRecognized = (key: string, field: keyof RecognizedItem, value: string) => {
    setRecognized((prev) =>
      prev.map((r) => (r._key === key ? { ...r, [field]: value } : r))
    );
  };

  const toggleSelect = (key: string) => {
    setRecognized((prev) =>
      prev.map((r) => (r._key === key ? { ...r, selected: !r.selected } : r))
    );
  };

  const addManual = () => {
    setRecognized((prev) => [
      ...prev,
      { _key: `manual-${Date.now()}`, name: '', category: 'その他', memo: '', selected: true },
    ]);
  };

  return (
    <div className="terminal-border p-4 mb-6">
      <h2 className="text-sm mb-4 glow">
        &gt; UPLOAD &amp; RECOGNIZE
      </h2>

      {/* Drop Zone */}
      <div
        className={`border border-dashed p-6 text-center cursor-pointer mb-4 transition-all ${
          dragOver
            ? 'border-green-400 bg-green-950/20'
            : 'border-green-900/50 hover:border-green-700'
        }`}
        style={{ borderColor: dragOver ? 'var(--green)' : undefined }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-xs" style={{ color: 'var(--green-dim)' }}>
          {dragOver ? '[ DROP FILES HERE ]' : '[ CLICK OR DRAG IMAGES HERE ]'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--green-dim)', opacity: 0.6 }}>
          PNG / JPG / WEBP — multiple files OK
        </p>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`preview-${i}`}
                className="w-20 h-20 object-cover"
                style={{ border: '1px solid var(--border)', filter: 'sepia(30%) hue-rotate(80deg)' }}
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 text-xs px-1"
                style={{ background: '#000', color: '#ff4444', border: '1px solid #7a1a1a' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs mb-3" style={{ color: '#ff4444' }}>
          ERROR: {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          className="btn-terminal primary text-xs"
          onClick={handleRecognize}
          disabled={images.length === 0 || recognizing}
        >
          {recognizing ? '[ ANALYZING... ]' : '[ ANALYZE WITH AI ]'}
        </button>
        <button className="btn-terminal text-xs" onClick={addManual}>
          [ + MANUAL ADD ]
        </button>
      </div>

      {/* Recognized items editor */}
      {recognized.length > 0 && (
        <div className="mt-4">
          <p className="text-xs mb-2" style={{ color: 'var(--green-dim)' }}>
            &gt; RECOGNITION RESULTS — EDIT BEFORE SAVING:
          </p>
          <div className="space-y-2">
            {recognized.map((item) => (
              <div
                key={item._key}
                className="p-3 terminal-border text-xs"
                style={{ opacity: item.selected ? 1 : 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item._key)}
                    style={{ accentColor: 'var(--green)' }}
                  />
                  <span style={{ color: 'var(--green-dim)' }}>REGISTER</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>NAME:</label>
                    <input
                      className="input-terminal text-xs"
                      value={item.name}
                      onChange={(e) => updateRecognized(item._key, 'name', e.target.value)}
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>CATEGORY:</label>
                    <select
                      className="select-terminal text-xs w-full"
                      value={item.category}
                      onChange={(e) => updateRecognized(item._key, 'category', e.target.value as Category)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: 'var(--green-dim)' }}>MEMO:</label>
                    <input
                      className="input-terminal text-xs"
                      value={item.memo}
                      onChange={(e) => updateRecognized(item._key, 'memo', e.target.value)}
                      placeholder="Notes / condition"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button
              className="btn-terminal primary text-xs"
              onClick={handleSave}
              disabled={saving || recognized.filter((r) => r.selected).length === 0}
            >
              {saving
                ? '[ SAVING... ]'
                : `[ SAVE ${recognized.filter((r) => r.selected).length} ITEM(S) ]`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
