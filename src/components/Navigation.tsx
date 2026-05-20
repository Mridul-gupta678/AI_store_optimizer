"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { shopDomain, disconnectStore } = useStore();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Simulator', href: '/simulator' },
    { name: 'Competitors', href: '/benchmark' },
  ];

  return (
    <div className="flex-gap" style={{ alignItems: 'center' }}>
      {shopDomain && navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            {link.name}
          </Link>
        );
      })}
      
      {shopDomain && (
        <button 
          onClick={() => {
            disconnectStore();
            router.push('/');
          }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: 'var(--text-secondary)', 
            padding: '0.4rem 0.8rem', 
            borderRadius: '8px', 
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
