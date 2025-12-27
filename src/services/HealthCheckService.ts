import type { IAgentAdapter, HealthCheckResult } from '../interfaces';

/**
 * Service for managing health check operations
 */
export class HealthCheckService {
  private adapters: Map<string, IAgentAdapter>;

  constructor() {
    this.adapters = new Map();
  }

  /**
   * Register an agent adapter
   */
  public registerAdapter(name: string, adapter: IAgentAdapter): void {
    this.adapters.set(name, adapter);
  }

  /**
   * Unregister an agent adapter
   */
  public unregisterAdapter(name: string): boolean {
    return this.adapters.delete(name);
  }

  /**
   * Get a specific adapter by name
   */
  public getAdapter(name: string): IAgentAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * Execute health check using a specific adapter
   */
  public async executeHealthCheck(adapterName: string): Promise<HealthCheckResult> {
    const adapter = this.adapters.get(adapterName);
    
    if (!adapter) {
      return {
        status: 'unhealthy',
        message: `Adapter '${adapterName}' not found`,
        timestamp: new Date(),
        details: {
          error: 'Adapter not registered'
        }
      };
    }

    try {
      return await adapter.processHealthCheck();
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Health check execution failed',
        timestamp: new Date(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Execute health check on all registered adapters
   */
  public async executeAllHealthChecks(): Promise<Record<string, HealthCheckResult>> {
    const results: Record<string, HealthCheckResult> = {};

    const promises = Array.from(this.adapters.entries()).map(async ([name, adapter]) => {
      try {
        results[name] = await adapter.processHealthCheck();
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          message: 'Health check failed',
          timestamp: new Date(),
          details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Get list of registered adapter names
   */
  public getRegisteredAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }
}
