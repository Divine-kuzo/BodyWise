import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BodyWise API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for BodyWise mental health platform',
      contact: {
        name: 'BodyWise Support',
        email: 'a.niyonseng@alustudent.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Alternative development server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Patient',
        description: 'Patient-specific endpoints for booking and managing consultations',
      },
      {
        name: 'Professional',
        description: 'Health professional endpoints for managing consultations and profile',
      },
      {
        name: 'Doctor Schedule',
        description: 'Doctor availability schedule management',
      },
      {
        name: 'Chat',
        description: 'AI-powered chat and messaging endpoints',
      },
      {
        name: 'Blog',
        description: 'Educational content and blog management endpoints',
      },
      {
        name: 'Testimonials',
        description: 'User testimonials and reviews management',
      },
      {
        name: 'Users',
        description: 'User profile and account management endpoints',
      },
      {
        name: 'Admin',
        description: 'System administrator endpoints for analytics, performance, and management',
      },
      {
        name: 'Cron Jobs',
        description: 'Automated tasks and email reminders',
      },
    ],
  },
  apis: ['./lib/swagger.ts', './app/api/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
