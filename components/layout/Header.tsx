"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Badge } from "@/components/ui/Badge";

const navigationGroups = [
  {
    key: "salary-data",
    titleKey: "salaryData",
    items: [
      { key: "pns", href: "/pns" },
      { key: "p3k", href: "/p3k" },
      { key: "tunjangan-kinerja", href: "/tunjangan-kinerja" },
      { key: "officials", href: "/officials" },
      { key: "regional-wages", href: "/regional-wages" },
    ],
  },
  {
    key: "tools",
    titleKey: "tools",
    items: [
      { key: "calculator", href: "/calculator" },
      { key: "browse", href: "/browse" },
      { key: "analysis", href: "/analysis" },
    ],
  },
];

const staticNavigation = [{ key: "about", href: "/about" }];

export function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(target),
      );

      if (!clickedInsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return (
      pathname === `/${locale}${href}` ||
      pathname.startsWith(`/${locale}${href}/`)
    );
  };

  const isGroupActive = (group: (typeof navigationGroups)[0]) => {
    return group.items.some((item) => isActiveLink(item.href));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8">
              <Image
                src="/logo.svg"
                alt="ForPublic.id Logo"
                width={32}
                height={32}
                className="w-full h-full"
              />
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
            {navigationGroups.map((group) => {
              const isGroupActiveState = isGroupActive(group);
              const isDropdownOpen = openDropdown === group.key;

              return (
                <div
                  key={group.key}
                  className="relative"
                  ref={(el) => {
                    dropdownRefs.current[group.key] = el;
                  }}
                >
                  <button
                    onClick={() => toggleDropdown(group.key)}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors cursor-pointer ${
                      isGroupActiveState
                        ? "text-foreground border-b-2 border-primary pb-1"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{t(group.titleKey as any)}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="py-2">
                        {group.items.map((item) => {
                          const isItemActive = isActiveLink(item.href);
                          return (
                            <Link
                              key={item.key}
                              href={`/${locale}${item.href}`}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isItemActive
                                  ? "text-primary bg-primary/5 border-r-2 border-primary font-medium"
                                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {t(item.key as any)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Static Navigation Items */}
            {staticNavigation.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground border-b-2 border-primary pb-1"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(item.key as any)}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher locale={locale} />
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
              {navigationGroups.map((group) => (
                <div key={group.key} className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                    {t(group.titleKey as any)}
                  </h3>
                  <div className="space-y-1 pl-2">
                    {group.items.map((item) => {
                      const isActive = isActiveLink(item.href);
                      return (
                        <Link
                          key={item.key}
                          href={`/${locale}${item.href}`}
                          className={`block text-sm font-medium transition-colors py-2 px-3 rounded-md ${
                            isActive
                              ? "text-foreground bg-gray-100"
                              : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(item.key as any)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Static Navigation for Mobile */}
              <div className="pt-2 border-t">
                {staticNavigation.map((item) => {
                  const isActive = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.key}
                      href={`/${locale}${item.href}`}
                      className={`block text-sm font-medium transition-colors py-2 px-3 rounded-md ${
                        isActive
                          ? "text-foreground bg-gray-100"
                          : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(item.key as any)}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
