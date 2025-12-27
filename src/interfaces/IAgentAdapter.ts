import type { IAgent } from './IAgent';
import type { HealthCheckResult } from './IAgent';

/**
 * Interface for agent adapters that provide communication layer
 */
export interface IAgentAdapter {
  /**
   * Gets the agent instance
   */
  getAgent(): IAgent;

  /**
   * Sends a request to the agent
   * @param request The request to send
   */
  sendRequest(request: AgentRequest): Promise<AgentResponse>;

  /**
   * Processes the health check through the adapter
   */
  processHealthCheck(): Promise<HealthCheckResult>;
}

/**
 * Request structure for agent communication
 */
export interface AgentRequest {
  action: string;
  params?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Response structure from agent communication
 */
export interface AgentResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: Date;
}
