'use client'

import { Menu } from 'lucide-react'
import { Logo } from '@/components/molecules/logo'
import { NavItem, NavItemProps } from '@/components/molecules/nav-item'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  logoText?: string
  logoHref?: string
  navItems?: NavItemProps[]
  className?: string
  rightContent?: React.ReactNode
}

export function Header({
  logoText = 'MyService',
  logoHref = '/',
  navItems = [],
  className,
  rightContent,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo href={logoHref} text={logoText} />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 mx-6 flex-1">
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>

        {/* Right Content (e.g., user menu, theme toggle) */}
        <div className="hidden md:flex items-center gap-4">
          {rightContent}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item, index) => (
                <NavItem key={index} {...item} />
              ))}
            </nav>
            {rightContent && (
              <div className="mt-8 flex flex-col gap-4">{rightContent}</div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
