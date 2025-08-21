"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu,
  X,
  Calculator,
  Search,
  BarChart3,
  Users,
  Info,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const navigation = [
  { key: "home", href: "/", icon: null },
  { key: "calculator", href: "/calculator", icon: Calculator },
  { key: "regional-wages", href: "/regional-wages", icon: MapPin },
  { key: "browse", href: "/browse", icon: Search },
  { key: "analysis", href: "/analysis", icon: BarChart3 },
  { key: "officials", href: "/officials", icon: Users },
  { key: "about", href: "/about", icon: Info },
];

export function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const LanguageSwitcher = () => {
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname.replace(`/${locale}`, "")
        : "";

    return (
      <div className="flex gap-1">
        <Link href={`/id${currentPath}`}>
          <Button
            variant={locale === "id" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2"
          >
            ID
          </Button>
        </Link>
        <Link href={`/en${currentPath}`}>
          <Button
            variant={locale === "en" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2"
          >
            EN
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md font-bold text-sm">
              Rp
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-bold text-foreground whitespace-nowrap">
                Public <span className="text-primary">Salary</span>
              </span>
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                by <span className="text-foreground">ForPublic</span>
                <span className="text-red-600">.id</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{t(item.key as any)}</span>
                </Link>
              );
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
                const Icon = item.icon;
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
                );
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
  );
}
