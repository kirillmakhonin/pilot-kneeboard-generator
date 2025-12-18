# Pilot Kneeboard Generator

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/kirillmakhonin)

"Pilot Kneeboard Generator" is a web application that helps pilots create professional kneeboard reference cards. It generates half-letter sized PDFs for speeds & briefings, weight & balance calculations, and emergency checklists. Users can customize all data, share configurations via URL, and export/import settings for different aircraft.

## Key Features

- **Speeds & Briefing Cards:** Create quick-reference cards with V-speeds, briefings, and notes for your aircraft.
- **Weight & Balance Calculator:** Calculate aircraft weight and balance with customizable positions and automatic moment calculations.
- **Emergency Checklists:** Build emergency and abnormal procedure checklists with highlighted items, groups, and proper aviation formatting.
- **Live PDF Preview:** See real-time preview of your kneeboard cards as you edit.
- **Pre-configured Aircraft:** Quick-start templates for common aircraft like Diamond DA-20 and Cessna 172S.
- **Data Portability:** Export and import your configurations in Base64-encoded JSON format.
- **Shareable URLs:** Generate links to share your exact configuration with other pilots.
- **Print-Ready Output:** Generate clean, half-letter (5.5" × 8.5") PDFs optimized for kneeboard use.

## Architecture

The project is a single-page application (SPA) built with the following technologies:

- **Frontend Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)

The application is entirely client-side. All data is managed in the browser's localStorage and state.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev`

## Disclaimer

This tool is provided for informational purposes only. Pilots must verify all information against official aircraft documentation, POH/AFM, and regulatory requirements. Use at your own risk and always consult with qualified instructors and aviation authorities.
