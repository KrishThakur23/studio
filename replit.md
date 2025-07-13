# Overview

This is a full-stack Walmart Pulse application that provides environmental monitoring and product recommendation systems for retail stores. The application uses React with TypeScript for the frontend, Express.js for the backend, and Drizzle ORM with PostgreSQL for data management. The system tracks environmental conditions (temperature, humidity, air quality) and provides intelligent product placement recommendations based on environmental factors and demand trends.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Walmart brand colors
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Middleware**: Custom logging and error handling
- **Development**: Hot reloading with Vite integration

## Data Layer
- **Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schemas between client and server
- **Validation**: Zod for runtime type validation
- **Storage**: In-memory storage implementation with interface for future database integration

# Key Components

## Database Schema
- **users**: User authentication and management
- **environmental_data**: Real-time environmental monitoring (temperature, humidity, AQI)
- **recommendations**: AI-driven product placement suggestions with priority scoring
- **demand_trends**: Historical sales data correlated with environmental conditions

## API Endpoints
- **Environmental Data**: 
  - GET `/api/environmental/current` - Current environmental readings
  - GET `/api/environmental/history/:hours` - Historical environmental data
  - POST `/api/environmental` - Submit new environmental readings
- **Recommendations**:
  - GET `/api/recommendations` - Active product recommendations
  - POST `/api/recommendations` - Create new recommendations
- **Demand Trends**:
  - GET `/api/trends/:hours` - Historical demand trend data

## Frontend Components
- **Dashboard**: Main view with environmental cards, recommendations, and analytics
- **Environmental Cards**: Real-time display of temperature, humidity, and air quality
- **Recommendation Cards**: Interactive product suggestion cards with priority indicators
- **Analytics Charts**: Data visualization for demand trends and environmental correlations
- **Store Layout**: Visual representation of optimized product placement suggestions

# Data Flow

1. **Environmental Data Collection**: Sensors provide real-time environmental readings
2. **Data Processing**: Backend processes and stores environmental data with timestamps
3. **Recommendation Engine**: Algorithms analyze environmental conditions and historical trends to generate product placement suggestions
4. **Real-time Updates**: Frontend polls for updates every 30 seconds for environmental data and every minute for recommendations
5. **User Interaction**: Store managers can apply recommendations and view analytics

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **recharts**: Data visualization
- **date-fns**: Date manipulation utilities

## UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Dynamic class name generation

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **drizzle-kit**: Database migrations and schema management

# Deployment Strategy

## Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations managed via `drizzle-kit push`

## Environment Configuration
- **Development**: Uses local development server with hot reloading
- **Production**: Serves static files and API from single Express server
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Apply database schema changes

The application is designed as a monorepo with shared TypeScript schemas, ensuring type safety across the full stack while maintaining separation of concerns between client and server code.