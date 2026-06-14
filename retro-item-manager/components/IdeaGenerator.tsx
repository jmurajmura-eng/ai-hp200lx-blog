'use client';

import { useState } from 'react';
import { NoteIdea } from '@/types';

interface IdeaGeneratorProps {
  itemCount: number;
}

export default function IdeaGenerator({ itemCount }: IdeaGeneratorProps) {
  const [ideas, setIdeas] = useState<NoteIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const res = await fetch('/api/generate-ideas', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Generation failed');
      }
      const data = await res.json() as NoteIdea[];
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-border p-4 mt-6">
      <h2 className="text-sm mb-4 glow">
        &gt; NOTE IDEA GENERATOR
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <button
          className="btn-terminal primary text-xs"
          onClick={handleGenerate}
          disabled={loading || itemCount === 0}
        >
          {loading ? '[ GENERATING... ]' : '[ GENERATE NOTE IDEAS ]'}
        </button>
        {itemCount === 0 && (
          <span className="text-xs" style={{ color: 'var(--green-dim)', opacity: 0.6 }}>
            (register items first)
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs mb-3" style={{ color: '#ff4444' }}>ERROR: {error}</p>
      )}

      {ideas.length > 0 && (
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--green-dim)' }}>
            &gt; SUGGESTED ARTICLE IDEAS:
          </p>
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <div key={i} className="terminal-border p-3 text-xs">
                <span style={{ color: 'var(--green-dim)' }}>[{String(i + 1).padStart(2, '0')}] </span>
                <span className="glow-dim">{idea.title}</span>
                <p className="mt-1" style={{ color: 'var(--green-dim)', opacity: 0.8 }}>
                  {idea.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
