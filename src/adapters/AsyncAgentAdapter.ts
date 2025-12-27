import { BaseAgentAdapter } from './BaseAgentAdapter';
import type { IAgent, AgentRequest, AgentResponse } from '../interfaces';

/**
 * Async adapter that communicates with agents asynchronously with queueing
 */
export class AsyncAgentAdapter extends BaseAgentAdapter {
  private requestQueue: Array<{
    request: AgentRequest;
    resolve: (response: AgentResponse) => void;
  }> = [];
  private processing: boolean = false;

  constructor(agent: IAgent) {
    super(agent);
  }

  public async sendRequest(request: AgentRequest): Promise<AgentResponse> {
    return new Promise((resolve) => {
      // Add request to queue with its resolver
      this.requestQueue.push({ request, resolve });

      // Process queue if not already processing
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const item = this.requestQueue.shift();
      if (!item) {
        break;
      }

      const { request, resolve } = item;

      try {
        if (!this.agent.isAvailable()) {
          resolve({
            success: false,
            error: 'Agent is not available',
            timestamp: new Date()
          });
          continue;
        }

        if (request.action === 'healthCheck') {
          const result = await this.agent.executeHealthCheck();
          resolve({
            success: true,
            data: result,
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            error: `Unsupported action: ${request.action}`,
            timestamp: new Date()
          });
        }
      } catch (error) {
        resolve({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date()
        });
      }
    }

    this.processing = false;
  }
}
