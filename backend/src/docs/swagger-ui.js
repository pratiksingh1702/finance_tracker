
'use strict';

const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger.config');

/**
 * Mount Swagger UI on an Express app.
 * @param {Express} app
 */
const mountSwagger = (app) => {
  const uiOptions = {
    customCss: `
      .swagger-ui .topbar { background-color: #1e293b; }
      .swagger-ui .topbar-wrapper img { content: url(''); }
    `,
    customSiteTitle: 'Finance Dashboard API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));

  // Expose raw JSON spec for tooling
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = { mountSwagger };
