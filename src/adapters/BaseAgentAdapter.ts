import type { IAgent, IAgentAdapter, AgentRequest, AgentResponse, HealthCheckResult } from '../interfaces';

/**
 * Abstract base class for agent adapters
 */
export abstract class BaseAgentAdapter implements IAgentAdapter {
  protected agent: IAgent;

  constructor(agent: IAgent) {
    this.agent = agent;
  }

  public getAgent(): IAgent {
    return this.agent;
  }

  public abstract sendRequest(request: AgentRequest): Promise<AgentResponse>;

  public async processHealthCheck(): Promise<HealthCheckResult> {
    const request: AgentRequest = {
      action: 'healthCheck',
      timestamp: new Date()
    };

    const response = await this.sendRequest(request);

    if (!response.success) {
      return {
        status: 'unhealthy',
        message: response.error || 'Health check failed',
        timestamp: new Date(),
        details: {
          agentId: this.agent.getId(),
          error: response.error
        }
      };
    }

    return response.data as HealthCheckResult;
  }
}
