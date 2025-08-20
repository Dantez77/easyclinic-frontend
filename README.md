# EasyClinic Frontend



##  Tech 

### Core Technologies
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework

### UI Components & Libraries
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Customizable icons
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **Sonner** - Toast notifications
- **Recharts** - Composable charting library



## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.17 or later
- **npm** 9+ or **pnpm** 8+ or **yarn** 1.22+
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Dantez77/easyclinic-frontend.git
cd easyclinic-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install

# Using yarn
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the environment variables as needed
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
easyclinic-frontend/
├── app/                    # Next.js App Router pages
│   ├── appointments/       # Appointments management
│   ├── consultation/       # Consultation interface
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (Radix UI)
│   ├── app-header.tsx     # Application header
│   ├── app-sidebar.tsx    # Navigation sidebar
│   └── theme-provider.tsx # Theme context provider
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and contexts
├── public/                 # Static assets
└── styles/                 # Additional stylesheets
```

## 🎯 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint

## Development

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines with Radix UI

### Component Development
- Create components in the `components/` directory
- Use the `ui/` components as building blocks
- Implement proper TypeScript interfaces
- Add JSDoc comments for complex components


### Build for Production

```bash
npm run build
```

## 🔮 Roadmap

- [ ] Patient management system
- [ ] Doctor scheduling interface
- [ ] Medical records integration
- [ ] Payment processing
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---
