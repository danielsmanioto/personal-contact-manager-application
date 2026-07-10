# Frontend - Personal Contact Manager

A modern React 18 + TypeScript + Vite application for managing personal contacts.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Validation
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm 11+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

Production build will be created in the `dist/` directory.

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Environment Variables

Create `.env.local` for development:

```env
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
frontend/
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   ├── App.css        # App styles
│   └── main.tsx       # Entry point
├── public/            # Static files
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
├── vitest.config.ts   # Vitest configuration
└── Dockerfile         # Docker configuration
```

## Docker

Build Docker image:

```bash
docker build -t contact-manager-frontend .
```

Run container:

```bash
docker run -p 80:80 contact-manager-frontend
```

## Code Quality

- **TypeScript Strict Mode** - Enabled
- **ESLint Rules** - No console.log in production
- **Test Coverage** - Target 80%+
- **Prettier** - Auto-formatting

## Development Notes

- No `any` types allowed
- All functions must have explicit return types
- No `console.log` allowed (use for debugging only)
- Components should be functional with hooks
- Keep components focused and reusable
