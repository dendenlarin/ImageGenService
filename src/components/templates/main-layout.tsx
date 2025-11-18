'use client'

import { Header, HeaderProps } from '@/components/organisms/header'
import { Sidebar, SidebarProps } from '@/components/organisms/sidebar'
import { cn } from '@/lib/utils'

export interface MainLayoutProps {
  children: React.ReactNode
  header?: HeaderProps
  sidebar?: SidebarProps
  showSidebar?: boolean
  className?: string
}

export function MainLayout({
  children,
  header,
  sidebar,
  showSidebar = true,
  className,
}: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      {header && <Header {...header} />}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <div className="hidden lg:block">
            <Sidebar {...sidebar} />
          </div>
        )}

        {/* Page Content */}
        <main className={cn('flex-1 overflow-y-auto', className)}>
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
