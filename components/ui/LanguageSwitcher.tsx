'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from './Button'
import { useTransition } from 'react'

interface LanguageSwitcherProps {
  locale: string
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLanguageSwitch = (newLocale: string) => {
    if (isPending || locale === newLocale) return
    
    startTransition(() => {
      // Replace the current locale in the pathname
      const pathSegments = pathname.split('/')
      
      if (pathSegments[1] === locale) {
        // Replace existing locale
        pathSegments[1] = newLocale
      } else {
        // If no locale in path, add it
        pathSegments.splice(1, 0, newLocale)
      }
      
      const newPath = pathSegments.join('/')
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <div className="flex gap-1">
      <Button
        variant={locale === "id" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3 flex items-center gap-1.5"
        disabled={isPending}
        onClick={() => handleLanguageSwitch("id")}
      >
        <span className="text-sm">🇮🇩</span>
        <span className="font-medium">ID</span>
      </Button>
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3 flex items-center gap-1.5"
        disabled={isPending}
        onClick={() => handleLanguageSwitch("en")}
      >
        <span className="text-sm">🇬🇧</span>
        <span className="font-medium">EN</span>
      </Button>
    </div>
  )
}