# Public Salary ForPublic.id - Development Guide

Indonesian Salary & Wage Transparency Platform

## Project Overview

Public Salary ForPublic.id is a comprehensive transparency platform providing access to Indonesian salary and wage information across multiple sectors. Built as part of the ForPublic.id ecosystem focusing on public transparency and accountability, covering civil service, public officials, regional minimum wages, and compensation data.

## Tech Stack & Architecture

**Framework & Runtime:**

- Next.js 15 with App Router
- React 19
- TypeScript
- Bun (primary runtime, package manager, and development server)
- Node.js compatibility (fallback for deployment)

**Styling & UI:**

- Tailwind CSS v4 with design tokens
- shadcn/ui component library
- Geist font family
- Responsive mobile-first design

**Internationalization:**

- next-intl for bilingual support (Indonesian/English)
- Locale-based routing (/id/, /en/)
- Complete translation for all user-facing content

**Data Architecture:**

- JSON-based data storage (NO DATABASE)
- Static files in /public/data/salary/
- Client-side data loading and processing

## Project Structure

```
salary/
├── app/                           # Next.js App Router
│   ├── [locale]/                  # Internationalized routes
│   │   ├── calculator/           # Salary calculator page
│   │   ├── browse/               # Browse data page
│   │   ├── analysis/             # Data analysis page
│   │   ├── officials/            # Public officials page
│   │   ├── about/                # About page
│   │   ├── layout.tsx            # Locale layout
│   │   └── page.tsx              # Homepage
│   ├── globals.css               # Global styles with design system
│   └── layout.tsx                # Root layout
├── components/                    # React components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── salary/                   # Salary-specific components
│   │   ├── SalaryCalculator.tsx  # Interactive calculator
│   │   ├── DataTable.tsx         # Salary data tables
│   │   ├── SearchInterface.tsx   # Search & filter
│   │   └── Charts.tsx            # Data visualizations
│   ├── layout/                   # Layout components
│   └── common/                   # Shared components
├── lib/                          # Utilities and types
│   ├── types/                    # TypeScript definitions
│   │   └── salary.ts             # Salary data types
│   ├── data.ts                   # Data fetching utilities
│   └── utils.ts                  # Helper functions
├── i18n/                         # Internationalization
│   ├── messages/                 # Translation files
│   │   ├── id.json               # Indonesian translations
│   │   └── en.json               # English translations
│   └── request.ts                # i18n configuration
├── public/data/salary/           # JSON data files
│   ├── pns/                      # Civil service data
│   │   ├── golongan.json         # Salary grades
│   │   ├── tunjangan-kinerja.json # Performance allowances
│   │   ├── benefits.json         # Additional benefits
│   │   └── historical.json       # Historical data
│   ├── officials/                # Public officials data
│   │   ├── nasional.json         # National officials
│   │   ├── gubernur.json         # Governors
│   │   ├── walikota-bupati.json  # Mayors & regents
│   │   └── legislative.json      # Legislative members
│   └── meta/                     # Metadata
│       ├── sources.json          # Data sources
│       └── last-updated.json     # Update timestamps
└── middleware.ts                 # next-intl middleware
```

## Data Architecture

### Civil Service Data (PNS)

- **Golongan (Grades)**: I/a through IV/e with base salary
- **Tunjangan Kinerja**: Performance allowances by ministry/position
- **Benefits**: Additional allowances and benefits
- **Historical**: Salary changes over time

### Public Officials Data

- **National**: President, ministers, attorney general, etc.
- **Provincial**: Governors and provincial officials
- **Local**: Mayors, regents, local officials
- **Legislative**: DPR, DPRD members

### Key TypeScript Types

```typescript
interface SalaryGolongan {
  id: string;
  golongan: string;
  pangkat: string;
  gajiPokok: number;
  description: { id: string; en: string };
  masaKerja: { min: number; max: number };
}

interface TunjanganKinerja {
  id: string;
  kementerian: { id: string; en: string };
  jabatan: { id: string; en: string };
  golongan: string[];
  nominal: number;
  kategori: "struktural" | "fungsional" | "pelaksana";
}
```

## Core Features

### 💰 Salary Calculator

- Interactive form with golongan, position, years of service
- Real-time calculation of base salary + allowances
- Breakdown of gross/net salary with deductions
- Export results functionality

### 🔍 Search & Browse

- Advanced search across positions, ministries, grades
- Multi-criteria filtering (salary range, grade, ministry)
- Sortable data tables with pagination
- Comparison tools between positions

### 📊 Data Analysis

- Salary distribution charts (using Recharts)
- Historical trend analysis
- Ministry comparison visualizations
- Statistical insights (median, average, ranges)

### 👨‍💼 Public Officials Directory

- Comprehensive official salary database
- Hierarchical browsing (national → provincial → local)
- Position-specific allowance breakdowns

### 🌍 Bilingual Support

- Complete Indonesian/English localization
- URL-based locale switching (/id/ vs /en/)
- Localized number and currency formatting

## Bun Runtime Setup

### Installation

1. **Install Bun** (if not already installed):
   ```bash
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash
   
   # Windows
   powershell -c "irm bun.sh/install.ps1 | iex"
   
   # Via npm (if you have Node.js)
   npm install -g bun
   ```

2. **Verify Installation**:
   ```bash
   bun --version
   ```

3. **Setup Project**:
   ```bash
   # Clone and setup
   git clone <repository>
   cd salary
   bun install
   bun run dev
   ```

### Configuration

The project is optimized for Bun runtime with:
- `package.json` scripts configured for Bun
- TypeScript configuration compatible with both Bun and Node.js
- Next.js configuration optimized for Bun's faster module resolution
- Development server runs on Bun for optimal performance

## Development Commands

```bash
# Development (Recommended: Bun Runtime)
bun run dev          # Start development server with Bun (localhost:3000)
bun run dev:turbo    # Development with Turbopack
npm run dev          # Fallback with Node.js runtime
npm run dev:turbo    # Node.js with Turbopack

# Production
bun run build        # Production build
bun run start        # Start production server with Bun
npm run build        # Vercel-compatible build
npm run start        # Node.js production server

# Code Quality
bun run lint         # ESLint checks
bun run typecheck    # TypeScript validation
bun run format       # Format with Prettier
bun run format:check # Check formatting

# Package Management
bun install          # Install dependencies (faster than npm)
bun add [package]    # Add new package
bun remove [package] # Remove package
```

## Bun Runtime Benefits

### Performance Advantages
- **3x faster** development server startup
- **2x faster** hot reload and file watching
- **50% less memory** usage during development
- **Faster package installation** compared to npm/yarn

### Development Experience
- Built-in TypeScript support without configuration
- Native ESM and CommonJS compatibility
- Integrated bundler, runtime, and package manager
- Better error messages and stack traces

### Compatibility
- Drop-in replacement for Node.js in most cases
- Full Next.js 15 and React 19 compatibility
- Works with all existing npm packages
- Vercel deployment ready (Node.js fallback)

## Data Management

### Adding New Salary Data

1. Update relevant JSON files in `/public/data/salary/`
2. Follow existing schema patterns
3. Update metadata with sources and timestamps
4. Test data loading in components
5. Run `bun run dev` to verify changes in development
6. Use `bun run build` to ensure production compatibility

### Translation Updates

1. Add new keys to both `id.json` and `en.json`
2. Use nested objects for organization
3. Test in both locales before committing

## Component Development Guidelines

### Salary Calculator Component

```typescript
// Real-time calculation with React state
const [results, setResults] = useState<SalaryCalculation | null>(null);

// Form handling with validation
const handleCalculate = (formData: CalculatorForm) => {
  const calculation = calculateSalary(
    formData.gajiPokok,
    formData.tunjanganKinerja,
    formData.tunjanganLain,
  );
  setResults(calculation);
};
```

### Data Table Component

- Sortable columns with TypeScript type safety
- Pagination for large datasets
- Export functionality (CSV, JSON)
- Mobile-responsive design

### Chart Components (Recharts)

- Salary distribution histograms
- Time-series trend charts
- Comparative bar/column charts
- Responsive design for mobile

## Performance Optimization

### Data Loading

- Static JSON files served from CDN
- Client-side caching of frequently accessed data
- Lazy loading for large datasets
- Progressive enhancement for JavaScript-disabled users

### Bundle Optimization

- Tree-shaking for unused chart components
- Code splitting by route
- Image optimization for any assets
- Minimal runtime dependencies

## SEO & Accessibility

### SEO Implementation

- Dynamic metadata generation per locale
- Structured data for salary information
- Sitemap generation for all pages
- OpenGraph and Twitter cards

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## Deployment (Vercel)

### Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/[locale]/page.tsx": {
      "maxDuration": 10
    }
  }
}
```

### Environment Variables

- `NEXT_PUBLIC_GA_ID`: Google Analytics tracking
- `NEXT_PUBLIC_API_URL`: API endpoint (if needed)

### Domain Setup

- Primary: salary.forpublic.id
- Subdomain configuration in Vercel dashboard
- SSL certificate auto-provisioning

## API Endpoints (Future)

### Planned REST API

```
GET /api/salary/golongan          # All salary grades
GET /api/salary/tunjangan         # Performance allowances
GET /api/officials                # Public officials
GET /api/calculate                # Salary calculation
```

## Data Sources & Legal

### Official Sources

- PP No. 15/2024: Civil service base salary
- UU No. 7/2017: State officials salary
- Ministry regulations: Performance allowances
- Regional regulations: Local official salaries

### Compliance

- Public information transparency law compliance
- Data accuracy verification process
- Regular updates from official sources
- Attribution to original regulations

## Contributing Guidelines

### Code Quality

- TypeScript strict mode enabled
- ESLint + Prettier for consistency
- Component-level testing recommended
- Performance budgets for bundle size

### Data Updates

- Verify official sources before updates
- Update metadata with change timestamps
- Test calculation accuracy
- Document regulatory changes

This platform serves as a cornerstone for public transparency, providing accurate, accessible, and comprehensive salary information to promote government accountability in Indonesia.
