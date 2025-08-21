import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  locale: string;
}

export function Footer() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo and Brand */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6">
              <Image
                src="/logo.svg"
                alt="ForPublic.id Logo"
                width={24}
                height={24}
                className="w-full h-full"
              />
            </div>
            <span className="text-lg font-bold">
              ForPublic<span className="text-red-600">.id</span>
            </span>
          </Link>

          {/* Project Description */}
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {locale === "id"
              ? "Platform transparansi gaji dan upah Indonesia dengan kalkulator interaktif dan data browsing yang komprehensif - meliputi sektor publik, pejabat, dan upah regional."
              : "Indonesian salary and wage transparency platform with interactive calculator and comprehensive data browsing - covering public sector, officials, and regional wages."}
          </p>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm">
            <Link
              href={`/${locale}/calculator`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {locale === "id" ? "Kalkulator" : "Calculator"}
            </Link>
            <span className="hidden sm:inline text-gray-600">•</span>
            <Link
              href={`/${locale}/browse`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {locale === "id" ? "Browse Data" : "Browse Data"}
            </Link>
            <span className="hidden sm:inline text-gray-600">•</span>
            <Link
              href="https://forpublic.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {locale === "id" ? "Website Utama" : "Main Website"}
            </Link>
            <span className="hidden sm:inline text-gray-600">•</span>
            <Link
              href="https://forpublic.id/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {locale === "id" ? "Kontak" : "Contact"}
            </Link>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © {currentYear} ForPublic
              <span className="text-red-600">.id</span>.{" "}
              {locale === "id"
                ? "Semua hak dilindungi. Dibuat dengan ❤️ untuk kebaikan publik."
                : "All rights reserved. Made with ❤️ for public good."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
