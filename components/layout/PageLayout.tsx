import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  className?: string
}

/**
 * Standardized page layout component with consistent padding and responsive spacing
 * 
 * @param children - Page content
 * @param maxWidth - Maximum width constraint (default: '6xl')
 * @param className - Additional CSS classes for the container
 */
export function PageLayout({ 
  children, 
  maxWidth = '6xl',
  className = ''
}: PageLayoutProps) {
  const maxWidthClass = `max-w-${maxWidth}`
  
  return (
    <div className="py-20 px-4 md:px-6 lg:px-8">
      <div className={`container mx-auto ${maxWidthClass} ${className}`}>
        {children}
      </div>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

/**
 * Standardized page header with consistent spacing and typography
 * 
 * @param title - Main page title
 * @param subtitle - Optional subtitle/description
 * @param className - Additional CSS classes
 */
export function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/**
 * Complete page wrapper with header and content
 * 
 * @param title - Page title
 * @param subtitle - Optional page subtitle
 * @param children - Page content
 * @param maxWidth - Container max width (default: '6xl')
 * @param headerClassName - Additional classes for header
 * @param containerClassName - Additional classes for container
 */
interface PageWrapperProps {
  title: string
  subtitle?: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  headerClassName?: string
  containerClassName?: string
}

export function PageWrapper({
  title,
  subtitle,
  children,
  maxWidth = '6xl',
  headerClassName = '',
  containerClassName = ''
}: PageWrapperProps) {
  return (
    <PageLayout maxWidth={maxWidth} className={containerClassName}>
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
        className={headerClassName}
      />
      {children}
    </PageLayout>
  )
}