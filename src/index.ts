import { Elysia } from 'elysia';
import { HealthCheckController } from './controllers';
import { HealthCheckService } from './services';
import { SimpleHealthAgent, AdvancedHealthAgent } from './agents';
import { DirectAgentAdapter, AsyncAgentAdapter } from './adapters';

/**
 * Main application class
 */
class Application {
  private app: Elysia;
  private healthCheckService: HealthCheckService;

  constructor() {
    this.app = new Elysia();
    this.healthCheckService = new HealthCheckService();
    this.initialize();
  }

  /**
   * Initialize the application
   */
  private initialize(): void {
    // Create agents
    const simpleAgent = new SimpleHealthAgent();
    const advancedAgent = new AdvancedHealthAgent();

    // Create adapters with different agents
    const directAdapter = new DirectAgentAdapter(simpleAgent);
    const asyncAdapter = new AsyncAgentAdapter(advancedAgent);

    // Register adapters with the service
    this.healthCheckService.registerAdapter('simple', directAdapter);
    this.healthCheckService.registerAdapter('advanced', asyncAdapter);

    // Setup routes
    this.setupRoutes();
  }

  /**
   * Setup application routes
   */
  private setupRoutes(): void {
    // Welcome route
    this.app.get('/', () => ({
      message: 'Welcome to Bun IA Health Check API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        healthByAdapter: '/health/:adapter',
        allHealth: '/health-all',
        adapters: '/adapters'
      }
    }));

    // Register health check controller routes
    const healthCheckController = new HealthCheckController(this.healthCheckService);
    healthCheckController.registerRoutes(this.app);
  }

  /**
   * Start the application
   */
  public start(port: number = 3000): void {
    this.app.listen(port);
    
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📊 Health check endpoint: http://localhost:${port}/health`);
    console.log(`📋 All health checks: http://localhost:${port}/health-all`);
    console.log(`🔌 Registered adapters: http://localhost:${port}/adapters`);
  }
}

// Create and start the application
const app = new Application();
app.start(3000);
