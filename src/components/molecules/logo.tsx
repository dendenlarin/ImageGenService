import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface LogoProps {
  href?: string
  className?: string
  text?: string
}

export function Logo({ href = '/', className, text = 'Logo' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity',
        className
      )}
    >
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
        {text.charAt(0)}
      </div>
      <span>{text}</span>
    </Link>
  )
}
