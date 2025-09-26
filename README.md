# Modern TypeScript Full-Stack Template

A modern, type-safe full-stack application template featuring React, Hono, and PostgreSQL with end-to-end type safety.

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Router** for file-based routing with type safety
- **TanStack Query** for server state management
- **Tailwind CSS** with shadcn/ui components
- **React Hook Form** with Zod validation
- **Vite** for fast development

### Backend

- **Hono** web framework for lightweight, fast APIs
- **tRPC** for type-safe client-server communication
- **Better-Auth** for authentication
- **Drizzle ORM** with PostgreSQL
- **Bun** runtime

### Database

- **PostgreSQL 17** with Drizzle ORM
- Auto-migration on server startup
- Type-safe database operations

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
bun install
```

2. Set up your database connection:

```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

3. Generate and apply database migrations:

```bash
bun db:generate
```

4. Start development servers:

```bash
bun dev
```

This will start:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Development Commands

### Root Commands

```bash
bun install           # Install all dependencies
bun dev               # Start both client and server
bun dev:client        # Start only frontend (port 5173)
bun dev:server        # Start only backend (port 3000)
bun typecheck         # Type check all packages
bun typecheck:client  # Type check frontend only
bun typecheck:server  # Type check backend only
bun db:generate       # Generate migration files
bun db:migrate        # Apply database migrations
bun clean             # Clean all node_modules and lock files
```

### Package-Specific Commands

**Client (`packages/client/`)**

```bash
cd packages/client
bun dev               # Start development server
bun build             # Build for production
bun typecheck         # Type check
```

**Server (`packages/server/`)**

```bash
cd packages/server
bun dev               # Start with hot reload
bun db:generate       # Generate migrations
bun db:migrate        # Apply migrations
bun typecheck         # Type check
```

## Key Features

### Type Safety

- **End-to-end type safety** with tRPC
- **Shared Zod schemas** for validation
- **TypeScript strict mode** enabled
- **Auto-generated route types** with TanStack Router

### Authentication

- **Better-Auth** integration
- Secure session management
- Ready-to-use auth components

### Database

- **PostgreSQL** with Drizzle ORM
- **Auto-migration** on development startup
- **Type-safe queries** and schemas
- **Migration versioning**

### UI/UX

- **shadcn/ui** component system
- **Radix UI** primitives
- **Tailwind CSS** styling
- **Dark mode** support with next-themes
- **Responsive design**

## Database Setup

### Migration Workflow

1. **Edit schema** in `packages/server/src/db/schema.ts`
2. **Generate migration**:

   ```bash
   bun db:generate
   ```

3. **Apply migration**:

   ```bash
   bun dev  # Auto-applies on startup
   # OR manually:
   bun db:migrate
   ```

### Database Configuration

Configure your database connection in your environment:

```bash
# Development
DATABASE_URL="postgresql://username:password@localhost:5432/your_db"
```

## Production Deployment

### Building

```bash
# Build client
cd packages/client && bun run build

# The server runs directly from TypeScript in production
```

### Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- Additional auth configuration as needed

## Contributing

1. Follow the existing code style and conventions
2. Run type checking before committing: `bun typecheck`
3. Ensure all migrations are properly generated and tested
4. Use the existing component patterns and utilities

## License

This is a template project. Customize the license as needed for your project.
