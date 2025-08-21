import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Calculator, Search, BarChart3, Users, TrendingUp, Code } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('hero')

  const features = [
    {
      icon: Calculator,
      titleKey: 'calculator',
      title: locale === 'id' ? 'Kalkulator Gaji' : 'Salary Calculator',
      description: locale === 'id' 
        ? 'Hitung estimasi gaji PNS berdasarkan golongan, jabatan, dan masa kerja'
        : 'Calculate civil service salary estimates by grade, position, and experience',
      href: '/calculator',
      color: 'text-blue-500'
    },
    {
      icon: Search,
      titleKey: 'browse',
      title: locale === 'id' ? 'Jelajahi Data' : 'Browse Data',
      description: locale === 'id'
        ? 'Telusuri dan bandingkan data gaji PNS dari berbagai kementerian'
        : 'Explore and compare civil service salary data across ministries',
      href: '/browse',
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      titleKey: 'analysis',
      title: locale === 'id' ? 'Analisis Data' : 'Data Analysis',
      description: locale === 'id'
        ? 'Visualisasi data untuk insights yang lebih mendalam'
        : 'Data visualization for deeper salary insights',
      href: '/analysis',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      titleKey: 'officials',
      title: locale === 'id' ? 'Pejabat Publik' : 'Public Officials',
      description: locale === 'id'
        ? 'Informasi gaji pejabat negara dan daerah'
        : 'National and regional public officials salary information',
      href: '/officials',
      color: 'text-red-500'
    },
    {
      icon: TrendingUp,
      titleKey: 'trends',
      title: locale === 'id' ? 'Tren Historis' : 'Historical Trends',
      description: locale === 'id'
        ? 'Lacak perubahan gaji dari waktu ke waktu'
        : 'Track salary changes over time',
      href: '/analysis',
      color: 'text-orange-500'
    },
    {
      icon: Code,
      titleKey: 'api',
      title: locale === 'id' ? 'API Terbuka' : 'Open API',
      description: locale === 'id'
        ? 'Akses data melalui API untuk pengembangan aplikasi'
        : 'API access for developers and researchers',
      href: '/about',
      color: 'text-gray-500'
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="mx-auto">
                {locale === 'id' ? 'Transparansi Publik' : 'Public Transparency'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/browse`}>
                <Button size="lg" className="px-8">
                  {t('cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/calculator`}>
                <Button variant="outline" size="lg" className="px-8">
                  {t('calculateSalary')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'id' ? 'Fitur Platform' : 'Platform Features'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'id' 
                ? 'Akses komprehensif ke data gaji dan transparansi kompensasi PNS Indonesia'
                : 'Comprehensive access to Indonesian civil service salary data and compensation transparency'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link key={feature.titleKey} href={`/${locale}${feature.href}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">17</div>
              <div className="text-muted-foreground">
                {locale === 'id' ? 'Golongan PNS' : 'Civil Service Grades'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">
                {locale === 'id' ? 'Posisi Jabatan' : 'Position Types'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">
                {locale === 'id' ? 'Kementerian & Lembaga' : 'Ministries & Agencies'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              {locale === 'id' 
                ? 'Mulai Jelajahi Data Transparansi'
                : 'Start Exploring Transparency Data'
              }
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'id'
                ? 'Dapatkan akses lengkap ke informasi gaji PNS dan pejabat publik Indonesia untuk mendukung akuntabilitas pemerintahan'
                : 'Get complete access to Indonesian civil service and public officials salary information to support government accountability'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/calculator`}>
                <Button size="lg" className="px-8">
                  {locale === 'id' ? 'Hitung Gaji Sekarang' : 'Calculate Salary Now'}
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button variant="outline" size="lg" className="px-8">
                  {locale === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}