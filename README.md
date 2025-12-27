# bun-ia-healthcheck

A TypeScript project using Bun + Elysia framework with an intelligent agent-based health check system.

## Architecture

This project follows a clean architecture pattern with separation of concerns:

```
src/
├── controllers/     # HTTP endpoint controllers (Elysia)
├── interfaces/      # TypeScript interfaces and types
├── adapters/        # Agent communication adapters
├── agents/          # Intelligent agent implementations
├── services/        # Business logic services
└── models/          # Data models
```

## Features

- **Adapter Pattern**: Flexible communication layer with agents
- **Multiple Agents**: Simple and Advanced health check agents
- **Service Layer**: Centralized health check management
- **RESTful API**: Clean HTTP endpoints using Elysia
- **TypeScript**: Full type safety and modern JavaScript features
- **Class-based**: All artifacts implemented as classes

## Installation

```bash
npm install
```

## Development

Run the development server with auto-reload:

```bash
npm run dev
```

## Production

Run the production server:

```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message and API information
- `GET /health` - Get health status using default adapter
- `GET /health/:adapter` - Get health status from specific adapter (simple/advanced)
- `GET /health-all` - Get health status from all registered adapters
- `GET /adapters` - List all registered adapters

## Example Usage

```bash
# Get default health check
curl http://localhost:3000/health

# Get health check from simple agent
curl http://localhost:3000/health/simple

# Get health check from advanced agent
curl http://localhost:3000/health/advanced

# Get all health checks
curl http://localhost:3000/health-all

# List available adapters
curl http://localhost:3000/adapters
```

## Architecture Details

### Interfaces
- `IAgent`: Base interface for all intelligent agents
- `IAgentAdapter`: Base interface for agent communication adapters

### Agents
- `BaseAgent`: Abstract base class for agents
- `SimpleHealthAgent`: Performs basic health checks
- `AdvancedHealthAgent`: Performs comprehensive health checks with detailed metrics

### Adapters
- `BaseAgentAdapter`: Abstract base class for adapters
- `DirectAgentAdapter`: Synchronous direct communication with agents
- `AsyncAgentAdapter`: Asynchronous communication with request queueing

### Services
- `HealthCheckService`: Manages agent adapters and orchestrates health checks

### Controllers
- `HealthCheckController`: Handles HTTP requests and responses for health check endpoints

## Technology Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript
- **Architecture**: Clean Architecture with Adapter Pattern
