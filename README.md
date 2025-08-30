# Public Salary Indonesia

<div align="center">
<img src="public/logo.svg" alt="Public Salary Indonesia" width="80" height="80">
<br><br>
<strong>by</strong> <span style="color: #ffffff; background: #000000; padding: 2px 4px; border-radius: 4px;">ForPublic</span><span style="color: #dc2626; background: #000000; padding: 2px 4px; border-radius: 4px;">.id</span>
</div>

A comprehensive Indonesian salary & wage transparency platform providing access to civil service, public officials, and regional wage information.

**Live Demo**: [salary.forpublic.id](https://salary.forpublic.id)

## Features

### Salary Calculator

- **Interactive calculation**: Real-time salary estimation with all allowances
- **Detailed breakdown**: Base salary, performance allowances, and deductions
- **Export functionality**: Save calculation results for reference

### Tunjangan Kinerja (Performance Allowances)

- **Ministry-wise data**: Complete allowance information by government institutions
- **Position-based calculation**: Allowances based on specific job positions
- **Grade compatibility**: Shows which salary grades are eligible

### Regional Wages

- **Provincial minimum wages**: UMP data across all provinces
- **District/city wages**: UMK data for local areas
- **Historical trends**: Wage progression over time
- **Interactive map**: Visual representation of wage distribution

### Public Officials Directory

- **National officials**: President, ministers, and high-ranking positions
- **Regional officials**: Governors, mayors, and local government positions
- **Legislative members**: DPR, DPD, and regional council salaries
- **Comprehensive database**: Complete compensation packages

### Bilingual Support

- Complete Indonesian and English interface
- SEO-friendly URLs for each language (`/id/tunjangan-kinerja` vs `/en/performance-allowance`)
- Localized number formatting and currency display

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Modern CSS framework with design tokens
- **shadcn/ui** - High-quality component library
- **Recharts** - Data visualization and charts
- **next-intl** - Internationalization support
- **Bun** - Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/forpublic-id/salary.git
cd salary

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

We welcome contributions from the community!

### How to Contribute

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

### Reporting Issues

Found a bug? [Create a new issue](https://github.com/forpublic-id/salary/issues) with:

- Clear bug description
- Steps to reproduce
- Screenshots if applicable
- Browser and device information

## License

This project is licensed under the [MIT License](LICENSE).

## About

Developed with care by the **[ForPublic.id](https://forpublic.id)** team.

For support and inquiries, visit our [website](https://forpublic.id) or create an issue on GitHub.
