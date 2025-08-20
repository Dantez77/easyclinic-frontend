# EasyClinic Frontend

A modern, responsive healthcare clinic management system built with Next.js 15, React 19, and Tailwind CSS. This application provides an intuitive interface for managing patient appointments, consultations, and clinic operations.

## 🚀 Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS for a professional, accessible interface
- **Responsive Design**: Mobile-first approach with responsive layouts for all devices
- **Type Safety**: Full TypeScript support for better development experience
- **Theme Support**: Dark/light mode with next-themes
- **Form Handling**: Advanced form management with React Hook Form and Zod validation
- **Component Library**: Comprehensive set of reusable UI components
- **Performance**: Optimized with Next.js 15 features and modern React patterns

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework

### UI Components & Libraries
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Sonner** - Toast notifications
- **Recharts** - Composable charting library

### Development Tools
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code linting and formatting

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

## 🔧 Development

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

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Implement dark/light theme support
- Use CSS custom properties for theming

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Dantez77/easyclinic-frontend/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Patient management system
- [ ] Doctor scheduling interface
- [ ] Medical records integration
- [ ] Payment processing
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

**Built with ❤️ for better healthcare management**
