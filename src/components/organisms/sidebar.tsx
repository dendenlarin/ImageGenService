'use client'

import { NavItem, NavItemProps } from '@/components/molecules/nav-item'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface SidebarSection {
  title?: string
  items: NavItemProps[]
}

export interface SidebarProps {
  sections: SidebarSection[]
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Sidebar({
  sections,
  className,
  header,
  footer,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-64 h-full border-r bg-background',
        className
      )}
    >
      {/* Header */}
      {header && (
        <>
          <div className="p-4">{header}</div>
          <Separator />
        </>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <NavItem key={itemIndex} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <>
          <Separator />
          <div className="p-4">{footer}</div>
        </>
      )}
    </aside>
  )
}
