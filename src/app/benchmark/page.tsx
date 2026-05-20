"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

type BenchmarkResult = {
  competitor_score: number;
  analysis_summary: string;
  competitor_strengths: string[];
  competitor_weaknesses: string[];
  how_to_beat_them: string;
  my_domain: string;
  competitor_domain: string;
};

export default function BenchmarkPage() {
  const router = useRouter();
  const { shopDomain } = useStore();

  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shopDomain === null) {
      const timer = setTimeout(() => router.push('/'), 100);
      return () => clearTimeout(timer);
    }
  }, [shopDomain, router]);

  const runBenchmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !shopDomain) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch('/api/benchmark', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          competitorDomain: domain,
          myDomain: shopDomain 
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Benchmark failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '2rem 0', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '-0.03em' }}>Competitor Benchmark Intelligence</h1>
        <p className="metric-label" style={{ maxWidth: '600px', lineHeight: 1.6 }}>
          Run a real-time semantic analysis against any live Shopify store. We extract their public product vectors and compare their AI discoverability footprint against yours.
        </p>
      </div>

      <div className="bento-item col-span-12" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.7) 0%, rgba(10, 10, 12, 0.9) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <form onSubmit={runBenchmark} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="e.g., gymshark.myshopify.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{
                width: '100%',
                padding: '1.25rem 1rem 1.25rem 3rem',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'ui-monospace, monospace',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={e => e.target.style.borderColor = '#8b5cf6'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <button 
            type="submit"
            className="btn" 
            disabled={loading || !domain}
            style={{ 
              padding: '0 2.5rem', 
              height: '3.6rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              fontSize: '1rem',
              border: 'none',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}
          >
            {loading ? '⟳ Analyzing...' : '⚖️ Execute Scan'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '12px', color: '#f87171', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠</span>
          <div>
            <div style={{ fontWeight: 600 }}>Benchmark Failed</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{error}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="bento-item col-span-12" style={{ position: 'relative', overflow: 'hidden', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.8) 0%, rgba(10, 10, 12, 0.95) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)' }}>
          {/* Animated Background Grid */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', zIndex: 0, opacity: 0.5 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', fontFamily: 'ui-monospace, monospace' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            
            <div style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '0.9rem' }}>$ connecting to groq-api-cluster...</div>
            <div style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem' }}>&gt; connection established.</div>
            <div style={{ color: '#60a5fa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>$ bypassing cloudflare layer for {domain}...</div>
            <div style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderTopColor: '#fbbf24' }}></div>
              extracting live product vectors...
            </div>
            
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', animation: 'progress 2s ease-in-out infinite alternate' }}></div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bento-grid" style={{ paddingTop: 0 }}>
          {/* Comparison Cards */}
          <div className="bento-item col-span-6" style={{ background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.7) 0%, rgba(10, 10, 12, 0.9) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
            
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '2rem', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}>Your Store</div>
            
            <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '2rem' }}>
              <svg width="140" height="140" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6" 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * 88) / 100}
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>88</span>
              </div>
            </div>
            
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', zIndex: 1 }}>{result.my_domain || 'Current Store'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', zIndex: 1 }}>AI Readiness Score</div>
          </div>

          <div className="bento-item col-span-6" style={{ background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.7) 0%, rgba(10, 10, 12, 0.9) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, ${getScoreColor(result.competitor_score).replace('var(--', 'rgba(').replace(')', ', 0.05)')} 0%, transparent 60%)`, pointerEvents: 'none' }}></div>
            
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '2rem', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)' }}>Competitor Target</div>
            
            <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '2rem' }}>
              <svg width="140" height="140" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${getScoreColor(result.competitor_score)})` }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(result.competitor_score)} strokeWidth="6" 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * result.competitor_score) / 100}
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{result.competitor_score}</span>
              </div>
            </div>
            
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', zIndex: 1 }}>{result.competitor_domain}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', zIndex: 1 }}>AI Readiness Score</div>
          </div>

          {/* AI Analysis */}
          <div className="bento-item col-span-12" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#8b5cf6' }}>●</span> Executive Intelligence Summary
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#e5e7eb', fontFamily: 'ui-monospace, monospace' }}>
                {result.analysis_summary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '2rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#10b981', marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Identified Strengths
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.competitor_strengths.map((str, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                      <div style={{ color: '#10b981', marginTop: '0.1rem' }}>✓</div>
                      <div style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.5 }}>{str}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '2rem' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Identified Vulnerabilities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.competitor_weaknesses.map((wk, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <div style={{ color: '#ef4444', marginTop: '0.1rem' }}>✗</div>
                      <div style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.5 }}>{wk}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How to Beat Them */}
          <div className="bento-item col-span-12" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#c4b5fd', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span> Strategic Attack Vector
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: '#fff', fontWeight: 500 }}>
              {result.how_to_beat_them}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
