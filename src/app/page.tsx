"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function ConnectStore() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { connectStore, shopDomain } = useStore();

  // If already connected, redirect to dashboard
  useEffect(() => {
    if (shopDomain) {
      router.push('/dashboard');
    }
  }, [shopDomain, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a valid Shopify store URL.');
      return;
    }

    setIsLoading(true);

    try {
      // Connect and save to global state
      connectStore(url);
      // Wait a moment for context to update
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err) {
      setError('Failed to connect. Please try again.');
      setIsLoading(false);
    }
  };

  // Prevent rendering login if we are actively redirecting
  if (shopDomain) return null;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        background: 'rgba(15, 15, 18, 0.6)', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: '#95BF47', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(149, 191, 71, 0.1)', border: '1px solid rgba(149, 191, 71, 0.2)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Connect Your Store
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Enter your Shopify URL to generate a deep diagnostic scan of your AI discoverability footprint.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
              Shopify Store URL
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.3)' }}>
                🌐
              </span>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. gymshark.com" 
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem 1rem 1rem 2.75rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#95BF47';
                  e.target.style.boxShadow = '0 0 0 1px #95BF47';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading || !url.trim()}
            style={{ 
              width: '100%',
              padding: '1rem', 
              fontSize: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.5rem', 
              marginTop: '0.5rem',
              background: isLoading || !url.trim() ? 'rgba(149, 191, 71, 0.5)' : '#95BF47', 
              color: '#000', 
              fontWeight: 600, 
              border: 'none',
              borderRadius: '12px',
              cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isLoading || !url.trim() ? 'none' : '0 0 20px rgba(149, 191, 71, 0.3)'
            }}
          >
            {isLoading ? 'Connecting...' : 'Initialize AI Engine'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)' }}>
            Zero installation required. We only scan public data.
          </p>
        </div>
      </div>
    </div>
  );
}
