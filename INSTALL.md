# Installation Guide

## Quick Start

### Prerequisites Check

First, ensure you have the required software installed:

```bash
# Check Node.js version (should be 18.17+)
node --version

# Check npm version (should be 9+)
npm --version

# Check Git version
git --version
```

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dantez77/easyclinic-frontend.git
   cd easyclinic-frontend
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using pnpm (recommended for better performance)
   npm install -g pnpm
   pnpm install
   
   # Using yarn
   npm install -g yarn
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create local environment file
   touch .env.local
   ```

   Add the following to your `.env.local`:
   ```env
   NEXT_PUBLIC_APP_NAME=EasyClinic
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Dependencies installation fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check TypeScript version compatibility
npx tsc --version

# Rebuild TypeScript
npm run build
```

### Performance Tips

- Use **pnpm** instead of npm for faster installations
- Enable **Yarn PnP** if using Yarn 2+
- Use **Node.js 18+** for better performance
- Consider using **SWC** compiler for faster builds

## Development Tools

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**

### VS Code Settings

Add to your `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## Next Steps

After successful installation:

1. **Explore the codebase** - Check the project structure in the main README
2. **Run tests** - `npm run test` (when tests are added)
3. **Check linting** - `npm run lint`
4. **Build the project** - `npm run build`
5. **Start contributing** - Follow the contributing guidelines in the main README

## Support

If you encounter issues:

1. Check the [Issues](https://github.com/Dantez77/easyclinic-frontend/issues) page
2. Search existing issues for similar problems
3. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce
