const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HR Recruitment Platform API',
      version: '1.0.0',
      description: 'API documentation for HR Recruitment Platform',
      contact: {
        name: 'API Support',
        email: 'support@hrrecruitment.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.hrrecruitment.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              example: 'securePassword123',
            },
          },
        },
        Candidate: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            qualifications: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Bachelor in Computer Science', 'AWS Certified'],
            },
            experience: {
              type: 'number',
              example: 5,
            },
            status: {
              type: 'string',
              enum: ['Applied', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
              example: 'Applied',
            },
          },
        },
        Job: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Senior Software Engineer',
            },
            description: {
              type: 'string',
              example: 'We are looking for an experienced software engineer...',
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['5+ years of experience', 'Proficiency in JavaScript'],
            },
            employmentType: {
              type: 'string',
              enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
              example: 'Full-time',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};