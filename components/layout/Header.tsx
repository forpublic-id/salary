"use client"

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Calculator, Search, BarChart3, Users, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const navigation = [
  { key: 'home', href: '/', icon: null },
  { key: 'calculator', href: '/calculator', icon: Calculator },
  { key: 'browse', href: '/browse', icon: Search },
  { key: 'analysis', href: '/analysis', icon: BarChart3 },
  { key: 'officials', href: '/officials', icon: Users },
  { key: 'about', href: '/about', icon: Info },
]

export function Header() {
  const t = useTranslations('navigation')
  const locale = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const LanguageSwitcher = () => (
    <div className="flex gap-1">
      <Link href={`/id${window.location.pathname.replace(`/${locale}`, '')}`}>
        <Button 
          variant={locale === 'id' ? 'default' : 'ghost'} 
          size="sm"
          className="h-8 px-2"
        >
          ID
        </Button>
      </Link>
      <Link href={`/en${window.location.pathname.replace(`/${locale}`, '')}`}>
        <Button 
          variant={locale === 'en' ? 'default' : 'ghost'} 
          size="sm"
          className="h-8 px-2"
        >
          EN
        </Button>
      </Link>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md font-bold text-lg">
              $
            </div>
            <div className="font-bold text-xl">
              Salary <span className="text-primary">ForPublic</span>
              <Badge variant="outline" className="ml-2 text-xs">
                ID
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{t(item.key as any)}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 px-4 md:px-6 lg:px-8">
            <nav className="space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{t(item.key as any)}</span>
                  </Link>
                )
              })}
            </nav>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}