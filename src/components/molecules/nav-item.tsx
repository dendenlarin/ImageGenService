'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface NavItemProps {
  href: string
  label: string
  icon?: LucideIcon
  className?: string
  active?: boolean
}

export function NavItem({
  href,
  label,
  icon: Icon,
  className,
  active,
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = active ?? pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
        isActive && 'bg-accent text-accent-foreground font-medium',
        !isActive && 'text-muted-foreground',
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Link>
  )
}
