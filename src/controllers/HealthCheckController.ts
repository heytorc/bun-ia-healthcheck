import { Elysia } from 'elysia';
import type { HealthCheckService } from '../services';

/**
 * Controller for health check endpoints
 */
export class HealthCheckController {
  private healthCheckService: HealthCheckService;

  constructor(healthCheckService: HealthCheckService) {
    this.healthCheckService = healthCheckService;
  }

  /**
   * Register routes with Elysia app
   */
  public registerRoutes(app: Elysia): Elysia {
    return app
      .get('/health', () => this.getHealthStatus())
      .get('/health/:adapter', ({ params: { adapter } }) => this.getHealthByAdapter(adapter))
      .get('/health-all', () => this.getAllHealthStatuses())
      .get('/adapters', () => this.getAdapters());
  }

  /**
   * Get overall health status
   */
  private async getHealthStatus() {
    const adapters = this.healthCheckService.getRegisteredAdapters();
    
    if (adapters.length === 0) {
      return {
        status: 'unhealthy',
        message: 'No health check adapters registered',
        timestamp: new Date()
      };
    }

    // Use the first adapter as default
    const firstAdapter = adapters[0];
    if (!firstAdapter) {
      return {
        status: 'unhealthy',
        message: 'No health check adapters available',
        timestamp: new Date()
      };
    }

    const result = await this.healthCheckService.executeHealthCheck(firstAdapter);
    
    return {
      ...result,
      adapter: firstAdapter
    };
  }

  /**
   * Get health status from a specific adapter
   */
  private async getHealthByAdapter(adapterName: string) {
    const result = await this.healthCheckService.executeHealthCheck(adapterName);
    
    return {
      ...result,
      adapter: adapterName
    };
  }

  /**
   * Get health status from all adapters
   */
  private async getAllHealthStatuses() {
    const results = await this.healthCheckService.executeAllHealthChecks();
    
    // Calculate overall status
    const statuses = Object.values(results);
    const overallStatus = statuses.every(r => r.status === 'healthy')
      ? 'healthy'
      : statuses.some(r => r.status === 'unhealthy')
      ? 'unhealthy'
      : 'degraded';

    return {
      overallStatus,
      timestamp: new Date(),
      adapters: results
    };
  }

  /**
   * Get list of registered adapters
   */
  private getAdapters() {
    const adapters = this.healthCheckService.getRegisteredAdapters();
    
    return {
      count: adapters.length,
      adapters: adapters.map(name => ({
        name,
        endpoint: `/health/${name}`
      }))
    };
  }
}
