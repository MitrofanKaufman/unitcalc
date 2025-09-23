# 🛍️ Wildberries Profitability Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

A modern profitability calculator for the Wildberries marketplace with an advanced interface and comprehensive analytics.

<!-- prettier-ignore-start -->

<details open>
  <summary><strong>📚 Quick Navigation</strong></summary>

| Section | Description |
|---------|-------------|
| [Overview](docs/overview.md) | Project purpose, key features |
| [Installation and Setup](docs/setup.md) | Requirements, environment setup, scripts |
| [Architecture](docs/architecture.md) | Directory structure, main modules, patterns |
| [API](docs/api.md) | Backend endpoints, request/response formats |
| [UI Components](docs/ui-components.md) | Libraries, styling principles, examples |
| [Testing](docs/testing.md) | Strategy, unit/integration/E2E examples |
| [Dev Processes](docs/dev-process.md) | Git flow, linting, formatting, CI |
| [Change History](README_HISTORY.md) | Automatically generated task table |
| [FAQ](docs/faq.md) | Answers to frequently asked questions |

</details>

> 💡 All documents are located in the `docs/` folder. The navigation above is maintained manually and can be expanded.

<!-- prettier-ignore-end -->

## 📋 Contents (quick table of contents for this page)

- [🚀 Features](#-features)
- [🛠 Technology Stack](#-technology-stack)
- [🏗 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Requirements](#-requirements)
  - [Installation](#-installation)
  - [Environment Setup](#-environment-setup)
  - [Launch](#-launch)
- [🧪 Testing](#-testing)
- [📦 Production Build](#-production-build)
- [🕑 Change History](#-change-history)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Features

- 🔍 **Product Search** by name with autocomplete
- 📊 **Detailed Analysis** of product profitability
- 💾 **Data Caching** for improved performance
- 📱 **Responsive Design** for all devices
- 🎨 **Modern UI/UX** with neumorphic design
- 🌓 **Theme Support** (light/dark/system)
- 📈 **Advanced Analytics** for sales
- 🏷 **Flexible Configuration** of calculation parameters
- 🔄 **Offline Access** to recent queries
- ⚡ **Fast Response** thanks to optimized code

## 🛠 Technology Stack

### Frontend
- **Languages**: TypeScript 5.x, JavaScript (ES2022+)
- **UI Framework**: React 18+ with hooks
- **Routing**: React Router 6
- **Styling**:
  - TailwindCSS 3.x
  - PostCSS
  - Autoprefixer
- **State Management**:
  - React Query 4.x (remote data)
  - Zustand (client state)
- **UI Components**:
  - Radix UI (accessible primitives)
  - Framer Motion (animations)
  - Headless UI (invisible components)
- **Forms and Validation**:
  - React Hook Form
  - Zod (schema validation)
- **Utilities**:
  - date-fns (date operations)
  - lodash (utilities)
  - axios (HTTP client)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x
- **Database**:
  - MySQL 8.0+ (main storage)
  - Redis 7.x (caching, queues)
- **ORM/ODM**:
  - TypeORM 0.3.x
  - Redis-om (cache client)
- **Authentication**:
  - JWT (JSON Web Tokens)
  - bcrypt (hashing)
- **Validation**:
  - class-validator
  - class-transformer
- **Documentation**:
  - Swagger/OpenAPI
  - JSDoc

### Development Tools
- **Build**:
  - Vite 4.x (bundler)
  - esbuild (build acceleration)
  - Rollup (bundling)
- **Linters and Formatters**:
  - ESLint 8.x
  - Prettier 3.x
  - Stylelint 15.x (styles)
  - MarkdownLint (markup)
- **Testing**:
  - Vitest (unit tests)
  - React Testing Library
  - MSW (mock API)
  - Playwright (e2e tests)
- **Git Hooks**:
  - Husky 8.x
  - lint-staged 13.x
  - commitlint (commit validation)
- **CI/CD**:
  - GitHub Actions
  - Docker + Docker Compose
  - Jest + React Testing Library
  - Docker + Docker Compose

## 🚀 Getting Started

### 📋 Requirements

- Node.js 18+
- MySQL 8.0+
- npm 9+ or yarn 1.22+
- Git

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wb-calculator.git
   cd wb-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### 🗄️ Database Setup

1. Create a `.env` file in the project root, copying settings from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Configure database connection parameters in the `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=wb_calculator
   ```

3. Install MySQL and create the database:
   ```sql
   CREATE DATABASE wb_calculator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Apply migrations:
   ```bash
   npm run db:migrate
   ```

5. (Optional) Populate the database with test data:
   ```bash
   npm run db:seed:products 50  # Creates 50 test products
   ```

### 🚀 Launch

1. Start the development server:
   ```bash
   npm run dev:all
   ```

2. Open [http://localhost:4000](http://localhost:4000) in your browser.

## 📂 Project Structure

```
wb-calculator/
├── src/
│   ├── api/              # API endpoints and controllers
│   ├── components/       # Reusable components
│   ├── db/
│   │   ├── entities/     # Database entities
│   │   ├── migrations/   # Database migrations
│   │   └── seed/        # Test data fillers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages
│   ├── services/        # Business logic and API work
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── public/              # Static files
├── .env.example         # Configuration example file
└── package.json         # Dependencies and scripts
```

## 🏗 Project Structure

```
unit.calculator/
├── app/                  # Client-side application
│   ├── assets/           # Static resources (images, fonts)
│   ├── components/       # Reusable React components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Helper libraries
│   ├── styles/           # Global styles and themes
│   └── utils/            # Helper utilities
│
├── server/               # Server-side application
│   ├── api/              # API endpoints
│   ├── controllers/      # Request processing controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # Route definitions
│   └── services/         # Business logic
│
├── shared/               # Shared code between client and server
│   ├── constants/        # Application constants
│   ├── types/            # Common TypeScript types
│   └── utils/            # Common utilities
│
├── config/               # Configuration files
│   ├── app/             # Application configuration
│   ├── db/              # Database configuration
│   ├── env/             # Environment variables
│   └── vite/            # Vite configuration
│
├── docs/                # Documentation
│   ├── api/             # API documentation
│   ├── guides/          # Guides
│   └── diagrams/        # Architecture diagrams
│
├── logs/                # Application logs
│   ├── app/             # Application logs
│   ├── db/              # Database logs
│   └── errors/          # Error logs
│
├── public/              # Static files
└── tests/               # Tests
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── e2e/             # End-to-end tests
```

## 🚀 Getting Started

### 📋 Requirements

- Node.js 18.0.0 or higher
- MySQL 8.0 or higher
- Redis 7.0 or higher
- npm 9.0.0 or higher

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unit.calculator.git
   cd unit.calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 🔧 Environment Setup

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your settings:
   ```env
   # Basic settings
   NODE_ENV=development
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=wb_calculator

   # Redis
   REDIS_URL=redis://localhost:6379

   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

### 🚀 Launch

1. Start the development server:
   ```bash
   # Launch client (port 3000)
   npm run dev

   # Or launch server (port 3001)
   npm run dev:server
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Check code coverage
npm run test:coverage
```

## 📦 Production Build

```bash
# Build client-side
npm run build

# Build server-side
npm run build:server

# Run in production mode
npm run start
```

## 🕑 Change History

A detailed table of all completed tasks is automatically generated and located in a separate file [`README_HISTORY.md`](README_HISTORY.md). The table supports sorting and search by description and date.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the fork (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is distributed under the MIT license. See the [LICENSE](LICENSE) file for additional information.

---

<div align="center">
  <p>Created with ❤️ for Wildberries sellers</p>
  <p>Questions and suggestions: <a href="mailto:support@wb-calculator.ru">support@wb-calculator.ru</a></p>
</div>

## 💾 Database Operations

### Migrations

- **Create a new migration**:
  ```bash
  npm run typeorm migration:create src/db/migrations/NameOfMigration
  ```

- **Apply migrations**:
  ```bash
  npm run db:migrate
  ```

- **Rollback the last migration**:
  ```bash
  npm run db:revert
  ```

- **Check migration status**:
  ```bash
  npm run db:status
  ```

### Seeding Data

- **Populate database with test products**:
  ```bash
  npm run db:seed:products 100  # Creates 100 test products
  ```

- **Clear test data**:
  ```bash
  npm run db:clean
  ```

### Backup

To create a database backup, use the `mysqldump` utility:

```bash
mysqldump -u username -p wb_calculator > backup_$(date +%Y%m%d_%H%M%S).sql
```

To restore from a backup:

```bash
mysql -u username -p wb_calculator < backup_file.sql
```

## 🛠 Development

- **Run linters**:
  ```bash
  npm run lint
  ```

- **Run tests**:
  ```bash
  npm test
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

## 📝 Documentation

### Product Service

`src/services/productService.ts` - service for working with product data:

- `getProduct(productId)` - get product data (first from cache, then from DB)
- `analyzeProduct(productId)` - initiate product data collection
- `getFromCache(productId)` - get data from cache
- `saveToCache(productId, data)` - save data to cache

### Components

- `ProductCard` - product card in search results
- `ProductDetails` - detailed product page
- `ProductAnalyse` - product data collection and analysis page
- `CalculatorForm` - search form and results display

## 📄 License

MIT
