import type { IAgent, HealthCheckResult } from '../interfaces';

/**
 * Abstract base class for intelligent agents
 */
export abstract class BaseAgent implements IAgent {
  protected id: string;
  protected name: string;
  protected available: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.available = true;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public isAvailable(): boolean {
    return this.available;
  }

  public setAvailable(available: boolean): void {
    this.available = available;
  }

  public abstract executeHealthCheck(): Promise<HealthCheckResult>;
}
