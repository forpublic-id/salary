import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  const currentYear = new Date().getFullYear()

  const footerSections = {
    platform: [
      { key: 'about', href: '/about' },
      { key: 'methodology', href: '/about#methodology' },
      { key: 'sources', href: '/about#sources' },
      { key: 'api', href: '/api' },
    ],
    features: [
      { key: 'calculator', href: '/calculator' },
      { key: 'browse', href: '/browse' },
      { key: 'analysis', href: '/analysis' },
      { key: 'officials', href: '/officials' },
    ],
    legal: [
      { key: 'privacy', href: '/privacy' },
      { key: 'terms', href: '/terms' },
    ]
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md font-bold text-lg">
                $
              </div>
              <div className="font-bold text-xl">
                Salary <span className="text-primary">ForPublic</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('description')}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Open Source
              </Badge>
              <Badge variant="outline" className="text-xs">
                Public Data
              </Badge>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2">
              {footerSections.platform.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`links.${item.key}` as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Features</h3>
            <ul className="space-y-2">
              {footerSections.features.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.key === 'calculator' && 'Salary Calculator'}
                    {item.key === 'browse' && 'Browse Data'}
                    {item.key === 'analysis' && 'Analysis'}
                    {item.key === 'officials' && 'Public Officials'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/forpublic-id/salary"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/forpublic_id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
              <a
                href="mailto:contact@forpublic.id"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>
                © {currentYear} ForPublic.id. All rights reserved.
              </p>
              <div className="flex gap-4">
                {footerSections.legal.map((item) => (
                  <Link
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {t(`legal.${item.key}` as any)}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Part of</span>
              <Link 
                href="https://forpublic.id" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80"
              >
                ForPublic.id
              </Link>
              <span>ecosystem</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}