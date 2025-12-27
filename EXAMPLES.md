# Adding a New Agent Example

This document demonstrates how to extend the system by adding new agents and adapters.

## Creating a New Agent

1. Create a new agent class in `src/agents/`:

```typescript
// src/agents/DatabaseHealthAgent.ts
import { BaseAgent } from './BaseAgent';
import type { HealthCheckResult } from '../interfaces';

export class DatabaseHealthAgent extends BaseAgent {
  constructor() {
    super('database-health-agent', 'Database Health Agent');
  }

  public async executeHealthCheck(): Promise<HealthCheckResult> {
    // Simulate database connection check
    await new Promise(resolve => setTimeout(resolve, 150));

    // In a real implementation, you would:
    // - Check database connectivity
    // - Verify query response time
    // - Check connection pool status
    
    const isConnected = true; // Simulate check
    const responseTime = Math.random() * 100;

    return {
      status: responseTime < 50 ? 'healthy' : 'degraded',
      message: isConnected ? 'Database is accessible' : 'Database connection failed',
      timestamp: new Date(),
      details: {
        agentId: this.id,
        agentName: this.name,
        connected: isConnected,
        responseTimeMs: Math.round(responseTime),
        connectionPool: {
          active: 5,
          idle: 10,
          max: 20
        }
      }
    };
  }
}
```

2. Export the new agent in `src/agents/index.ts`:

```typescript
export { DatabaseHealthAgent } from './DatabaseHealthAgent';
```

3. Register the agent in `src/index.ts`:

```typescript
// Create the new agent
const databaseAgent = new DatabaseHealthAgent();

// Create an adapter for it
const databaseAdapter = new DirectAgentAdapter(databaseAgent);

// Register with the service
this.healthCheckService.registerAdapter('database', databaseAdapter);
```

## Creating a Custom Adapter

1. Create a new adapter class in `src/adapters/`:

```typescript
// src/adapters/RetryAgentAdapter.ts
import { BaseAgentAdapter } from './BaseAgentAdapter';
import type { IAgent, AgentRequest, AgentResponse } from '../interfaces';

export class RetryAgentAdapter extends BaseAgentAdapter {
  private maxRetries: number;

  constructor(agent: IAgent, maxRetries: number = 3) {
    super(agent);
    this.maxRetries = maxRetries;
  }

  public async sendRequest(request: AgentRequest): Promise<AgentResponse> {
    let lastError: string | undefined;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        if (!this.agent.isAvailable()) {
          throw new Error('Agent is not available');
        }

        if (request.action === 'healthCheck') {
          const result = await this.agent.executeHealthCheck();
          return {
            success: true,
            data: result,
            timestamp: new Date()
          };
        }

        throw new Error(`Unsupported action: ${request.action}`);
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        
        if (attempt < this.maxRetries - 1) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 100)
          );
        }
      }
    }

    return {
      success: false,
      error: `Failed after ${this.maxRetries} attempts: ${lastError}`,
      timestamp: new Date()
    };
  }
}
```

2. Export the new adapter:

```typescript
// src/adapters/index.ts
export { RetryAgentAdapter } from './RetryAgentAdapter';
```

## Usage Example

```typescript
import { DatabaseHealthAgent } from './agents';
import { RetryAgentAdapter } from './adapters';
import { HealthCheckService } from './services';

const service = new HealthCheckService();

// Create agent
const dbAgent = new DatabaseHealthAgent();

// Wrap with retry adapter
const retryAdapter = new RetryAgentAdapter(dbAgent, 5);

// Register
service.registerAdapter('database-with-retry', retryAdapter);

// Use
const result = await service.executeHealthCheck('database-with-retry');
console.log(result);
```

## Testing Your New Agent

```bash
# Start the server
npm run dev

# Test the new endpoint
curl http://localhost:3000/health/database
curl http://localhost:3000/health/database-with-retry
```
