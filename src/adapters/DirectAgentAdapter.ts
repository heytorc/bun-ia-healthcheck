import { BaseAgentAdapter } from './BaseAgentAdapter';
import type { IAgent, AgentRequest, AgentResponse } from '../interfaces';

/**
 * Direct adapter that communicates with agents synchronously
 */
export class DirectAgentAdapter extends BaseAgentAdapter {
  constructor(agent: IAgent) {
    super(agent);
  }

  public async sendRequest(request: AgentRequest): Promise<AgentResponse> {
    try {
      if (!this.agent.isAvailable()) {
        return {
          success: false,
          error: 'Agent is not available',
          timestamp: new Date()
        };
      }

      if (request.action === 'healthCheck') {
        const result = await this.agent.executeHealthCheck();
        return {
          success: true,
          data: result,
          timestamp: new Date()
        };
      }

      return {
        success: false,
        error: `Unsupported action: ${request.action}`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }
}
