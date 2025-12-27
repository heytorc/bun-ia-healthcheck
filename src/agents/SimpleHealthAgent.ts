import { BaseAgent } from './BaseAgent';
import type { HealthCheckResult } from '../interfaces';

/**
 * Simple agent that performs basic health checks
 */
export class SimpleHealthAgent extends BaseAgent {
  constructor() {
    super('simple-health-agent', 'Simple Health Agent');
  }

  public async executeHealthCheck(): Promise<HealthCheckResult> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    return {
      status: 'healthy',
      message: 'System is running normally',
      timestamp: new Date(),
      details: {
        agentId: this.id,
        agentName: this.name,
        memoryUsage: {
          heapUsedMB,
          heapTotalMB,
          percentage: Math.round((heapUsedMB / heapTotalMB) * 100)
        }
      }
    };
  }
}
