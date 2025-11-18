// Mock Next.js Link component for Storybook
import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: any
}

const Link = ({ href, children, ...props }: LinkProps) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

export default Link
