import { BaseAgentAdapter } from './BaseAgentAdapter';
import type { IAgent, AgentRequest, AgentResponse } from '../interfaces';

/**
 * Async adapter that communicates with agents asynchronously with queueing
 */
export class AsyncAgentAdapter extends BaseAgentAdapter {
  private requestQueue: AgentRequest[] = [];
  private processing: boolean = false;

  constructor(agent: IAgent) {
    super(agent);
  }

  public async sendRequest(request: AgentRequest): Promise<AgentResponse> {
    // Add request to queue
    this.requestQueue.push(request);

    // Process queue if not already processing
    if (!this.processing) {
      return await this.processQueue();
    }

    // Wait for the queue to be processed
    return await this.waitForProcessing(request);
  }

  private async processQueue(): Promise<AgentResponse> {
    this.processing = true;

    try {
      const request = this.requestQueue.shift();
      if (!request) {
        this.processing = false;
        return {
          success: false,
          error: 'No request in queue',
          timestamp: new Date()
        };
      }

      if (!this.agent.isAvailable()) {
        this.processing = false;
        return {
          success: false,
          error: 'Agent is not available',
          timestamp: new Date()
        };
      }

      if (request.action === 'healthCheck') {
        const result = await this.agent.executeHealthCheck();
        this.processing = false;
        return {
          success: true,
          data: result,
          timestamp: new Date()
        };
      }

      this.processing = false;
      return {
        success: false,
        error: `Unsupported action: ${request.action}`,
        timestamp: new Date()
      };
    } catch (error) {
      this.processing = false;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  private async waitForProcessing(request: AgentRequest): Promise<AgentResponse> {
    // Simple implementation - in production, use proper event system
    while (this.processing) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return await this.processQueue();
  }
}
