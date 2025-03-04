/* eslint-disable @typescript-eslint/no-unused-vars */
// Marks the component as a client component in Next.js 13+
'use client'; 

import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils'; // Ensure `cn` is implemented
import Link from 'next/link';

// Define the type for dynamic route params
interface Params {
  storeId?: string;
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const MainNav: React.FC<MainNavProps> = ({ className , ...props }) => {
  const params = useParams() as Params; // Cast to `Params` type
  const pathname = usePathname(); // Gets the current pathname

  const storeId = params?.storeId; // Extract storeId from params
  if (!storeId) {
    console.warn('storeId is undefined. Ensure the URL includes the dynamic segment.');
    return <div>No store selected</div>; // Fallback UI if storeId is missing
  }

  const routes = [

    {
      href: `/${storeId}`,
      label: 'Overview',
      active: pathname === `/${storeId}`,

    },
    {
      href: `/${storeId}/products`,
      label: 'Products',
      active: pathname === `/${storeId}/products`,
    },

    {
      href: `/${storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${storeId}/orders`,
    },

    {
      href: `/${storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/${storeId}/billboards`,
    },

    {
      href: `/${storeId}/categories`,
      label: `Categories`,
      active: pathname === `/${storeId}/categories`,
    },

    {
      href: `/${storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/${storeId}/sizes`,

    },

    {
      href: `/${storeId}/colours`,
      label: `Colours`,
      active: pathname === `/${storeId}/colours`
    },
    
    {
      href: `/${storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${storeId}/settings`,
    },

  ];

  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default MainNav;
