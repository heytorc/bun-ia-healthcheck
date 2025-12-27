/**
 * Interface for intelligent agents that can perform health checks
 */
export interface IAgent {
  /**
   * Unique identifier for the agent
   */
  getId(): string;

  /**
   * Name of the agent
   */
  getName(): string;

  /**
   * Executes a health check operation
   * @returns Promise with the health check result
   */
  executeHealthCheck(): Promise<HealthCheckResult>;

  /**
   * Checks if the agent is available
   */
  isAvailable(): boolean;
}

/**
 * Result of a health check operation
 */
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}
