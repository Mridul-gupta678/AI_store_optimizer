"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

type Product = {
  id: string;
  title: string;
  descriptionHtml: string;
  status: string;
};

export default function Simulator() {
  const router = useRouter();
  const { shopDomain } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (shopDomain === null) {
      const timer = setTimeout(() => router.push('/'), 100);
      return () => clearTimeout(timer);
    }
    
    if (shopDomain) {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: shopDomain })
      })
        .then(res => res.json())
        .then(data => {
          if (data.products) setProducts(data.products);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [shopDomain, router]);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || products.length === 0) return;
    
    setSimulating(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/simulate-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, products })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Simulation failed.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <div style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Left Panel: Vector Context */}
      <div style={{ width: '350px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
            Active Context
          </h2>
        </div>
        
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Loaded {products.length} product vectors from Shopify API. Ready for semantic inference.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loading ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Connecting...</div>
            ) : products.map(p => (
              <div key={p.id} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#d1d5db', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                <span style={{ color: '#6b7280', fontFamily: 'monospace' }}>[{p.id.slice(-4)}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Inference Terminal */}
      <div style={{ flex: 1, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Llama 3.3 Simulator Engine</h1>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.2rem', fontFamily: 'ui-monospace, monospace' }}>Groq LPUs / 70B Versatile</div>
          </div>
        </div>

        {/* Results / Terminal Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="custom-scrollbar">
          {!result && !simulating && (
            <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.5 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.9rem' }}>Awaiting Query Input...</p>
            </div>
          )}

          {simulating && (
            <div style={{ margin: 'auto', width: '100%', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'ui-monospace, monospace', color: '#60a5fa', marginBottom: '1rem' }}>
                <span>Initializing Agent...</span>
                <span>[██████████░░]</span>
              </div>
              <div className="scanner-laser" style={{ width: '100%', height: '1px', background: '#3b82f6', animation: 'scan 1.5s ease-in-out infinite alternate' }}></div>
            </div>
          )}

          {result && !simulating && (
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: result.confidence_score > 70 ? '#10b981' : result.confidence_score > 40 ? '#f59e0b' : '#ef4444' }}>
                  {result.confidence_score}%
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>Match Confidence</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{result.overall_verdict}</div>
                </div>
              </div>

              <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'ui-monospace, monospace', display: 'flex', gap: '1rem' }}>
                  <span style={{ color: '#ef4444' }}>●</span>
                  <span style={{ color: '#f59e0b' }}>●</span>
                  <span style={{ color: '#10b981' }}>●</span>
                  <span style={{ marginLeft: '1rem' }}>inference_log.md</span>
                </div>
                <div style={{ padding: '1.5rem', fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.8, fontFamily: 'ui-monospace, monospace' }}>
                  {result.reasoning}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(0deg, rgba(20, 20, 24, 0.9) 0%, rgba(20, 20, 24, 0) 100%)' }}>
          <form onSubmit={handleSimulate} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.2rem' }}>
              &gt;
            </div>
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Query the Agent (e.g., 'Do you have beginner snowboards?')" 
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.4)', 
                border: '1px solid rgba(59, 130, 246, 0.3)', 
                padding: '1.25rem 1.5rem 1.25rem 3rem', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                fontFamily: 'ui-monospace, monospace',
                outline: 'none',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
            />
            <button 
              type="submit" 
              disabled={simulating || !query.trim() || loading}
              style={{ 
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(59,130,246,0.1)', 
                color: '#60a5fa',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontFamily: 'ui-monospace, monospace',
                cursor: (simulating || !query.trim() || loading) ? 'not-allowed' : 'pointer',
                opacity: (simulating || !query.trim() || loading) ? 0.5 : 1
              }}
            >
              EXECUTE
            </button>
          </form>
        </div>

      </div>
    </div>
    </div>
  );
}
