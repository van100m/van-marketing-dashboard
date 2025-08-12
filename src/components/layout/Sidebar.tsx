'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Target,
  TrendingUp,
  Settings,
  Zap,
  Activity,
  Bot,
  FileText,
  Shield,
  ChevronRight
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Executive overview'
  },
  {
    name: 'Agents',
    href: '/agents',
    icon: Bot,
    description: '15 AI Marketing Agents',
    children: [
      { name: 'All Agents', href: '/agents' },
      { name: 'Analytics Agent', href: '/agents/analytics' },
      { name: 'Campaign Agent', href: '/agents/campaign' },
      { name: 'Content Agent', href: '/agents/content' },
      { name: 'Accountability Agent', href: '/agents/accountability' }
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance insights'
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: Target,
    description: 'Campaign management'
  },
  {
    name: 'Forecasting',
    href: '/forecasting',
    icon: TrendingUp,
    description: 'AI predictions'
  },
  {
    name: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    description: 'System health'
  }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children: Array<{ href: string }>) => {
    return children.some(child => pathname === child.href || pathname.startsWith(child.href));
  };

  React.useEffect(() => {
    // Auto-expand parent items if child is active
    navigation.forEach(item => {
      if (item.children && isChildActive(item.children)) {
        setExpandedItems(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  return (
    <div className={cn('flex h-full w-64 flex-col bg-white border-r border-gray-200', className)}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">VAN</h1>
            <p className="text-xs text-gray-500">Marketing AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const itemIsActive = isActive(item.href);
          const childIsActive = hasChildren && isChildActive(item.children!);

          return (
            <div key={item.name}>
              {/* Main navigation item */}
              <div className="relative">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      'group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50',
                      itemIsActive || childIsActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight 
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50',
                      itemIsActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Children navigation items */}
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-50',
                        pathname === child.href || pathname.startsWith(child.href)
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <div>VAN Marketing Intelligence</div>
          <div>15-Agent System v1.0</div>
        </div>
      </div>
    </div>
  );
}