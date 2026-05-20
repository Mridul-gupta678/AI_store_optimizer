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

const MagicLoader = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing semantics...",
    "Injecting SEO keywords...",
    "Formatting for AI Agents...",
    "Finalizing optimized content..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '300px' }}>
      {/* Scanner line container */}
      <div style={{ position: 'relative', width: '100%', height: '120px', background: 'rgba(15, 15, 18, 0.8)', border: '1px solid rgba(149, 191, 71, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Ghost lines for structure */}
        <div style={{ position: 'absolute', top: 20, left: 20, right: 20, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
        <div style={{ position: 'absolute', top: 40, left: 20, right: 60, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
        <div style={{ position: 'absolute', top: 60, left: 20, right: 40, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
        
        {/* Scanning laser */}
        <div className="scanner-laser" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#95BF47', boxShadow: '0 0 10px 2px rgba(149, 191, 71, 0.5)',
          animation: 'scan 2s ease-in-out infinite alternate'
        }}></div>
      </div>
      
      {/* Dynamic Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#95BF47', fontSize: '0.85rem', fontWeight: 500 }}>
        <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderTopColor: '#95BF47', borderRightColor: 'rgba(149,191,71,0.2)', borderBottomColor: 'rgba(149,191,71,0.2)', borderLeftColor: 'rgba(149,191,71,0.2)' }}></div>
        {steps[step]}
      </div>
    </div>
  );
};

export default function ProductsOptimizer() {
  const router = useRouter();
  const { shopDomain } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [optimizedData, setOptimizedData] = useState<Record<string, any>>({});

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

  const handleOptimize = async (product: Product) => {
    setOptimizing(product.id);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          description: product.descriptionHtml
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setOptimizedData(prev => ({ ...prev, [product.id]: data }));
      } else {
        alert(data.error || 'Optimization failed. The AI returned an invalid response.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while connecting to the AI Optimizer.');
    } finally {
      setOptimizing(null);
    }
  };

  const handleApply = async (product: Product) => {
    setApplying(product.id);
    try {
      const data = optimizedData[product.id];
      const res = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          descriptionHtml: data.optimized_description_html
        })
      });
      
      if (res.ok) {
        setApplied(prev => [...prev, product.id]);
      } else {
        alert('Failed to update product on Shopify. Ensure write_products scope is enabled.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Auto-Fix Action Hub</h1>
          <p className="metric-label">Optimize your products for AI discovery with one click.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner"></div>
          <h2>Loading products...</h2>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No products found</h2>
          <p className="metric-label">Add products to your Shopify store to optimize them.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {products.map(product => (
            <div key={product.id} style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{product.title}</h3>
              
              <div className="diff-editor">
                {/* Diff Editor Header */}
                <div className="diff-header">
                  <div className="diff-tab">
                    <span style={{ opacity: 0.6 }}>📄</span> Original Content
                  </div>
                  <div className="diff-tab active" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span>✨</span> AI Optimized Content
                    </div>
                    {applied.includes(product.id) && (
                      <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>Live on Store</span>
                    )}
                  </div>
                </div>

                {/* Diff Editor Body */}
                <div className="diff-body">
                  <div className="diff-divider"></div>
                  
                  {/* Left Pane: Original */}
                  <div className="diff-pane custom-scrollbar" style={{ opacity: 0.7 }}>
                    <div 
                      style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<em>No description available.</em>' }}
                    />
                  </div>

                  {/* Right Pane: AI Optimized */}
                  <div className="diff-pane custom-scrollbar" style={{ position: 'relative' }}>
                    {optimizedData[product.id] ? (
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Enterprise Diagnostic Report UI */}
                        <div style={{ 
                          marginBottom: '2rem', 
                          padding: '1.5rem', 
                          background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.7) 0%, rgba(10, 10, 12, 0.9) 100%)', 
                          border: '1px solid rgba(255,255,255,0.08)', 
                          borderRadius: '16px',
                          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <h4 style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
                              <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>⎚</span> Deep Data Diagnostics
                            </h4>
                            <div style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>Llama 3.3 Inference</div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '2rem', alignItems: 'start' }}>
                            {/* Score Ring */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                                <svg width="90" height="90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#scoreGrad)" strokeWidth="6" 
                                    strokeDasharray="282.7" 
                                    strokeDashoffset={282.7 - (282.7 * (optimizedData[product.id].ai_readability_score || 95)) / 100}
                                    strokeLinecap="round" 
                                    transform="rotate(-90 50 50)" 
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                  />
                                  <defs>
                                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#10b981" />
                                      <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{optimizedData[product.id].ai_readability_score || 95}</span>
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>AI Readability</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Score / 100</div>
                              </div>
                            </div>
                            
                            {/* Gaps & Risks List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              {optimizedData[product.id].misrepresentation_risks && optimizedData[product.id].misrepresentation_risks.length > 0 && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <span style={{ marginRight: '0.4rem' }}>⚠</span> High-Priority Misrepresentation Risks
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {optimizedData[product.id].misrepresentation_risks.map((risk: string, idx: number) => (
                                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginTop: '0.4rem', flexShrink: 0 }}></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{risk}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {optimizedData[product.id].quality_gaps && optimizedData[product.id].quality_gaps.length > 0 && (
                                <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <span style={{ marginRight: '0.4rem' }}>✦</span> Missing Data Vectors Injected
                                  </div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {optimizedData[product.id].quality_gaps.map((gap: string, idx: number) => (
                                      <span key={idx} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', color: '#c4b5fd', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                        {gap}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1.5rem 0' }}></div>

                        <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--success)' }}>
                          {optimizedData[product.id].optimized_title}
                        </h4>
                        <div 
                          style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#e5e7eb' }}
                          dangerouslySetInnerHTML={{ __html: optimizedData[product.id].optimized_description_html }}
                        />
                        
                        {/* Apply Button */}
                        {!applied.includes(product.id) && (
                          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <button 
                              className="btn" 
                              onClick={() => handleApply(product)}
                              disabled={applying === product.id}
                              style={{ padding: '0.5rem 1.5rem', background: 'var(--success)' }}
                            >
                              {applying === product.id ? '⟳ Pushing to Shopify...' : '🚀 Push to Live Store'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Empty State CTA */
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(16, 185, 129, 0.02)',
                        zIndex: 1
                      }}>
                        {optimizing === product.id ? (
                          <MagicLoader />
                        ) : (
                          <button 
                            className="btn-glass" 
                            onClick={() => handleOptimize(product)}
                            style={{ 
                              padding: '0.8rem 2rem', 
                              fontSize: '0.95rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.6rem', 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              border: '1px solid rgba(255, 255, 255, 0.15)' 
                            }}
                          >
                            <span style={{ color: '#95BF47' }}>⚡</span> Generate AI Fix
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
