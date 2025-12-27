import { BaseAgent } from './BaseAgent';
import type { HealthCheckResult } from '../interfaces';

/**
 * Advanced agent that performs comprehensive health checks
 */
export class AdvancedHealthAgent extends BaseAgent {
  private checkCount: number = 0;

  constructor() {
    super('advanced-health-agent', 'Advanced Health Agent');
  }

  public async executeHealthCheck(): Promise<HealthCheckResult> {
    this.checkCount++;
    
    // Simulate more complex processing
    await new Promise(resolve => setTimeout(resolve, 200));

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryPercentage = Math.round((heapUsedMB / heapTotalMB) * 100);

    // Determine status based on memory usage
    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    let message = 'All systems operational';

    if (memoryPercentage > 90) {
      status = 'unhealthy';
      message = 'High memory usage detected';
    } else if (memoryPercentage > 75) {
      status = 'degraded';
      message = 'Memory usage is elevated';
    }

    return {
      status,
      message,
      timestamp: new Date(),
      details: {
        agentId: this.id,
        agentName: this.name,
        checkCount: this.checkCount,
        uptime: {
          seconds: Math.round(uptime),
          formatted: this.formatUptime(uptime)
        },
        memoryUsage: {
          heapUsedMB,
          heapTotalMB,
          percentage: memoryPercentage,
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024)
        },
        platform: process.platform,
        nodeVersion: process.version
      }
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }
}
