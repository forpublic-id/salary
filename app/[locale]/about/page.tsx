import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return {
    title: `About - Salary ForPublic.id`,
    description: 'Learn about our methodology and data sources for Indonesian civil service salary transparency',
  }
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('about')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          About Salary ForPublic.id
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Promoting transparency in Indonesian civil service and public officials compensation
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Salary ForPublic.id is dedicated to promoting transparency and accountability in Indonesian 
              public sector compensation. We provide comprehensive, accurate, and accessible information 
              about civil service salaries and public officials' compensation to foster better public 
              understanding and oversight.
            </p>
            <p>
              As part of the ForPublic.id ecosystem, we believe that transparency in public finance 
              is essential for building trust between government and citizens, enabling informed 
              public discourse, and supporting evidence-based policy making.
            </p>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sources & Methodology</CardTitle>
            <CardDescription>
              All data is sourced from official government regulations and public documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Civil Service Salaries</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <Badge variant="outline">PP No. 15/2024</Badge> - Base salary structure</li>
                  <li>• <Badge variant="outline">Ministry Regulations</Badge> - Performance allowances</li>
                  <li>• <Badge variant="outline">Government Circulars</Badge> - Additional benefits</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Public Officials</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <Badge variant="outline">UU No. 7/2017</Badge> - State officials compensation</li>
                  <li>• <Badge variant="outline">Regional Regulations</Badge> - Local officials salary</li>
                  <li>• <Badge variant="outline">Official Announcements</Badge> - Current rates</li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Data Quality Assurance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">100%</div>
                  <div className="text-sm">Official Sources</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">Monthly</div>
                  <div className="text-sm">Data Updates</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="font-bold text-2xl text-primary">Cross-checked</div>
                  <div className="text-sm">Verification</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Salary Calculator</h4>
                    <p className="text-sm text-muted-foreground">
                      Interactive calculator for civil service compensation based on grade, position, and experience
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Advanced Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive search and filtering across all salary data with export capabilities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Visualization</h4>
                    <p className="text-sm text-muted-foreground">
                      Interactive charts and analytics for salary trends and comparisons
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">👨‍💼</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Officials Directory</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete database of national and regional public officials compensation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Bilingual Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Full Indonesian and English language support for accessibility
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">🔗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Open API</h4>
                    <p className="text-sm text-muted-foreground">
                      Developer-friendly API access for research and application development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This platform operates in full compliance with Indonesian public information 
              transparency laws, including:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>UU No. 14/2008</strong> - Public Information Openness Law</li>
              <li>• <strong>Government Transparency Principles</strong> - Right to public information access</li>
              <li>• <strong>Data Protection Standards</strong> - Responsible data handling and privacy protection</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              All salary information presented is already public by law and sourced from official 
              government publications. No private or confidential information is collected or displayed.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We welcome feedback, suggestions, and reports of data inaccuracies. Help us improve 
              transparency in Indonesian public service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">GitHub: forpublic-id/salary</Badge>
              <Badge variant="outline">Email: contact@forpublic.id</Badge>
              <Badge variant="outline">Web: forpublic.id</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}