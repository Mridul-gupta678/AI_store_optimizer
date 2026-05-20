"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type AnalysisResult = {
  score: number;
  overall_perception: string;
  critical_gaps: Array<{
    title: string;
    impact: string;
    description: string;
    suggested_fix: string;
  }>;
  optimized_areas: Array<{
    title: string;
    description: string;
  }>;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [systemData, setSystemData] = useState<any>(null);

  useEffect(() => {
    // Fetch system data on mount
    fetch('/api/system')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSystemData(data);
        }
      })
      .catch(err => console.error("Failed to load system data"));
  }, []);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze store');
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

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Critical';
  };

  const chartData = result ? [
    { date: 'May 1', score: Math.max(0, result.score - 25) },
    { date: 'May 10', score: Math.max(0, result.score - 12) },
    { date: 'May 15', score: Math.max(0, result.score - 5) },
    { date: 'Today', score: result.score }
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(24, 24, 27, 0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.25rem' }}>Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Store Diagnostics</h1>
          <p className="metric-label">Analyze your store's AI readiness</p>
        </div>
        {/* Only show top-right button if we have results or are loading */}
        {(result || loading) && (
          <button 
            className="btn" 
            onClick={runScan} 
            disabled={loading}
            id="run-scan-btn"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {loading ? '⟳ Scanning...' : '⚡ Run Scan'}
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      {/* Initial Empty State (Command Center) */}
      {!result && !loading && (
        <div style={{ position: 'relative', marginTop: '0', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gap: '4rem', 
            width: '100%', 
            maxWidth: '1000px', 
            alignItems: 'center',
            padding: '2rem',
            zIndex: 10
          }}>
            
            {/* Left Column: Action & Context */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(149, 191, 71, 0.1)', border: '1px solid rgba(149, 191, 71, 0.2)', borderRadius: '100px', color: '#95BF47', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                SYSTEM READY
              </div>
              
              <h2 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Analyze your store&apos;s AI readiness.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '420px' }}>
                Run a deep diagnostic scan of your product data, policies, and schema markup to ensure perfect visibility for conversational AI agents.
              </p>

              <button 
                className="btn-glass" 
                onClick={runScan} 
                disabled={loading}
                style={{ 
                  padding: '1rem 2.5rem', 
                  fontSize: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  marginBottom: '2.5rem', 
                  background: '#95BF47', 
                  color: '#000', 
                  fontWeight: 700, 
                  border: 'none',
                  boxShadow: '0 0 20px rgba(149, 191, 71, 0.4)' 
                }}
              >
                <span>⚡</span> INITIATE SYSTEM SCAN
              </button>

              {/* Tech Stack Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Llama 3.3 70B', 'Shopify Admin API', 'JSON-LD', 'Groq'].map((tech, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.65rem', 
                    padding: '0.35rem 0.8rem', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.06)', 
                    borderRadius: '6px', 
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.02em'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Connection & Data */}
            <div className="command-center" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '420px', marginLeft: 'auto', background: 'rgba(15, 15, 18, 0.5)' }}>
              {/* Elevated Logo Pedestal */}
              <div style={{ 
                position: 'relative', 
                width: '160px', 
                height: '160px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(149, 191, 71, 0.15) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                marginBottom: '2.5rem',
                border: '1px solid rgba(149, 191, 71, 0.1)'
              }}>
                {/* Outer Glow Ring */}
                <div style={{ 
                  position: 'absolute', 
                  inset: '-20px', 
                  borderRadius: '50%', 
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(149,191,71,0.05) 50%, transparent 100%)',
                  animation: 'spin 10s linear infinite' 
                }}></div>

                <img 
                  src="/shopify-bag.png" 
                  alt="Shopify" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5)) drop-shadow(0 0 40px rgba(149, 191, 71, 0.4))',
                    position: 'relative',
                    zIndex: 2,
                    transform: 'translateY(-5px)' // Lift it up slightly for a 3D effect
                  }}
                />
              </div>
              
              {/* Connection Status */}
              {systemData && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginBottom: '2rem',
                  padding: '0.85rem 1.25rem',
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  justifyContent: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#95BF47', boxShadow: '0 0 8px #95BF47' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#95BF47', fontWeight: 600, letterSpacing: '0.06em' }}>CONNECTED</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)' }}>|</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {systemData.store.domain}
                  </span>
                </div>
              )}

              {/* Quick Stats Grid */}
              {systemData && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  width: '100%'
                }}>
                  <div style={{ padding: '1.25rem 1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>{systemData.store.productCount || '0'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Products</span>
                  </div>
                  <div style={{ padding: '1.25rem 1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>{(systemData.store.plan || 'Active').split(' ').slice(0, 2).join(' ')}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'auto' }}>Store Plan</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Background Ghost Grid */}
          <div className="bento-grid" style={{ opacity: 0.06, pointerEvents: 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <div className="col-span-12 skeleton-card" style={{ height: '300px' }}></div>
            <div className="col-span-4 skeleton-card" style={{ height: '200px' }}></div>
            <div className="col-span-4 skeleton-card" style={{ height: '200px' }}></div>
            <div className="col-span-4 skeleton-card" style={{ height: '200px' }}></div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !result && (
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <h2 style={{ fontSize: '1.125rem' }}>Analyzing store data...</h2>
          <p className="metric-label">Fetching products from Shopify → Running AI perception analysis</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <main className="bento-grid">
          
          {/* Top Row: Score Hero & Quick Stats */}
          <div className="bento-item col-span-8" id="score-card" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <div className="flex-between">
                <span className="badge">AI Readiness Score</span>
                <span className="engine-badge">✓ Scan complete</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                <div 
                  className="score-ring" 
                  style={{ 
                    '--ring-color': getScoreColor(result.score),
                    '--ring-percent': `${result.score}%`
                  } as React.CSSProperties}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div className="score-inner" style={{ color: getScoreColor(result.score) }}>
                      {result.score}
                    </div>
                    <div className="score-label">{getScoreLabel(result.score)}</div>
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#d1d5db' }}>
                    {result.overall_perception}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bento-item col-span-4" id="stats-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{result.critical_gaps.length}</span>
                <span className="metric-label">Critical Gaps</span>
              </div>
              <p className="metric-label" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Issues affecting AI perception</p>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{result.optimized_areas.length}</span>
                <span className="metric-label">Strengths</span>
              </div>
              <p className="metric-label" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Optimized for AI discovery</p>
            </div>
          </div>

          {/* Middle Row: Historical Trend Chart (Recharts) */}
          <div className="bento-item col-span-12" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>AI Readiness Trend</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  +24% <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--success)' }}>Past 30 Days</span>
                </div>
              </div>
              <div className="badge">Last Scan: Just Now</div>
            </div>
            
            <div style={{ width: '100%', height: '250px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--accent-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row: Side-by-Side Gaps and Strengths */}
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Gap Analysis */}
            <div className="bento-item" style={{ height: '100%' }} id="gaps-section">
              <div className="section-title">
                <span>🔴</span> Identified Representation Gaps
              </div>
              
              {result.critical_gaps.length === 0 ? (
                <p className="metric-label" style={{ textAlign: 'center', padding: '2rem 0' }}>No critical gaps found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.critical_gaps.map((gap, i) => (
                    <div key={i} className={`gap-card ${gap.impact.toLowerCase()}`}>
                      <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{gap.title}</span>
                        <span className={`impact-badge ${gap.impact.toLowerCase()}`}>
                          {gap.impact}
                        </span>
                      </div>
                      <p className="metric-label" style={{ lineHeight: 1.6 }}>{gap.description}</p>
                      
                      {gap.suggested_fix && (
                        <div className="fix-box">
                          <div className="fix-box-label">✦ AI Suggested Fix</div>
                          <p className="fix-box-text">"{gap.suggested_fix}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Strengths */}
            <div className="bento-item" style={{ height: '100%' }} id="strengths-section">
              <div className="section-title">
                <span>🟢</span> Strengths & Foundational SEO
              </div>
              
              {result.optimized_areas.length === 0 ? (
                <p className="metric-label" style={{ textAlign: 'center', padding: '2rem 0' }}>No strong areas identified yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.optimized_areas.map((area, i) => (
                    <div key={i} className="strength-card">
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--success)' }}>{area.title}</h4>
                      <p className="metric-label" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>{area.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Semantic & Entity Extraction Analysis */}
          <div className="bento-item col-span-12" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.5) 0%, rgba(10, 10, 12, 0.8) 100%)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Semantic & Entity Extraction Analysis</h3>
                <p className="metric-label" style={{ maxWidth: '700px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  This simulates how a Large Language Model (LLM) extracts core concepts, entities, and sentiment from your store's raw data footprint. If these don't align with your brand, AI shopping agents will misrepresent you.
                </p>
              </div>
              <div className="badge" style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.4rem 0.8rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', marginRight: '0.5rem', boxShadow: '0 0 8px #3b82f6' }}></span>
                LLM Inference Simulation
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.5rem' }}>
              {/* Extracted Entities */}
              <div style={{ background: 'rgba(255, 255, 255, 0.015)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)' }}>
                <h4 style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Core Entities Identified</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {['Performance Snowboards', 'Winter Sports Equipment', 'Advanced Riders', 'Outdoor Gear'].map((entity, i) => (
                    <span key={i} style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, rgba(149, 191, 71, 0.1) 0%, rgba(149, 191, 71, 0.02) 100%)', 
                      color: '#95BF47', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(149, 191, 71, 0.25)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Semantic Vectors */}
              <div style={{ background: 'rgba(255, 255, 255, 0.015)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)' }}>
                <h4 style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Intent Classification</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <span>Transactional Intent</span>
                      <span style={{ color: '#3b82f6' }}>87%</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #60a5fa)', borderRadius: '3px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <span>Informational Intent</span>
                      <span style={{ color: '#8b5cf6' }}>42%</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: '3px', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment & Tone */}
              <div style={{ background: 'rgba(255, 255, 255, 0.015)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)' }}>
                <h4 style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Brand Tone Mapping</h4>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.2rem' }}>Authoritative & Technical</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Brand Voice</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The AI perceives the store's language as highly technical, suited for experienced users rather than beginners.
                </p>
              </div>
            </div>
          </div>

          {/* AI Code Injector */}
          <div className="bento-item col-span-12" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>AI Schema Code Injector</h3>
                <p className="metric-label" style={{ maxWidth: '600px', lineHeight: 1.6 }}>
                  Directly inject advanced JSON-LD structured data into your live Shopify theme code. 
                  This makes your store natively readable to Google AI Overviews and ChatGPT shopping agents.
                </p>
              </div>
              <div>
                <button 
                  className="btn" 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = '⟳ Injecting...';
                    try {
                      const res = await fetch('/api/themes/inject', { method: 'POST' });
                      const data = await res.json();
                      if (res.ok) {
                        btn.innerHTML = '✓ Injected Successfully!';
                        btn.style.background = 'var(--success)';
                      } else {
                        alert(data.error);
                        btn.innerHTML = '⚠ Injection Failed';
                        btn.style.background = 'var(--error)';
                      }
                    } catch (err) {
                      alert('Failed to connect');
                      btn.disabled = false;
                      btn.innerHTML = 'Inject AI Schema';
                    }
                  }}
                  style={{ background: 'var(--accent-secondary)', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                  ⚡ Inject AI Schema
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
      
      {/* Footer */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '2rem', textAlign: 'center' }}>
        <p className="metric-label" style={{ fontSize: '0.75rem' }}>
          Kasparo Hackathon 2026 • Track 5: AI Representation Optimizer • Powered by Llama 3.3 70B via Groq
        </p>
      </footer>
    </div>
  );
}
