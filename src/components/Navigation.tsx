"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Simulator', href: '/simulator' },
    { name: 'Competitors', href: '/benchmark' },
  ];

  return (
    <div className="flex-gap">
      {navLinks.map((link) => {
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
    </div>
  );
}
