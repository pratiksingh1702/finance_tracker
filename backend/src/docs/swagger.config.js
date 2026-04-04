
'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const path         = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Finance Dashboard API',
      version:     '1.0.0',
      description: 'Finance Data Processing and Access Control Backend API',
      contact: {
        name:  'Finance Dashboard Team',
        email: 'dev@financedashboard.io',
      },
    },
    servers: [
      {
        url:         `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
          description:  'Enter your JWT access token.',
        },
      },
      schemas: {
        // ── Success Response ───────────────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Operation successful.' },
            data:    { type: 'object' },
          },
        },

        // ── Error Response ─────────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            success:    { type: 'boolean', example: false },
            message:    { type: 'string',  example: 'Something went wrong.' },
            statusCode: { type: 'integer', example: 400 },
            errors:     { type: 'array',   items: { type: 'object' } },
          },
        },

        // ── Pagination Meta ────────────────────────────────────────────────────
        PaginationMeta: {
          type: 'object',
          properties: {
            total:       { type: 'integer', example: 100 },
            page:        { type: 'integer', example: 1 },
            limit:       { type: 'integer', example: 20 },
            totalPages:  { type: 'integer', example: 5 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },

        // ── User ──────────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id:         { type: 'string', example: '665f1b2c3d4e5f6789abcdef' },
            name:        { type: 'string', example: 'Jane Doe' },
            email:       { type: 'string', example: 'jane@example.com' },
            role:        { type: 'string', enum: ['viewer','analyst','admin'] },
            isActive:    { type: 'boolean' },
            createdAt:   { type: 'string', format: 'date-time' },
            lastLoginAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Transaction ────────────────────────────────────────────────────────
        Transaction: {
          type: 'object',
          properties: {
            _id:      { type: 'string' },
            title:    { type: 'string', example: 'Office Supplies' },
            amount:   { type: 'number', example: 149.99 },
            type:     { type: 'string', enum: ['income','expense'] },
            category: { $ref: '#/components/schemas/Category' },
            date:     { type: 'string', format: 'date-time' },
            notes:    { type: 'string' },
            status:   { type: 'string', enum: ['pending','completed','cancelled'] },
            tags:     { type: 'array', items: { type: 'string' } },
            createdAt:{ type: 'string', format: 'date-time' },
          },
        },

        // ── Category ──────────────────────────────────────────────────────────
        Category: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            name:        { type: 'string', example: 'Food & Dining' },
            description: { type: 'string' },
            color:       { type: 'string', example: '#10B981' },
            icon:        { type: 'string', example: 'utensils' },
          },
        },

        // ── Analytics Summary ─────────────────────────────────────────────────
        Summary: {
          type: 'object',
          properties: {
            totalIncome:          { type: 'number', example: 5000.00 },
            totalExpenses:        { type: 'number', example: 3200.50 },
            netBalance:           { type: 'number', example: 1799.50 },
            transactionCount:     { type: 'integer', example: 42 },
            incomeCount:          { type: 'integer', example: 12 },
            expenseCount:         { type: 'integer', example: 30 },
            avgTransactionAmount: { type: 'number', example: 195.24 },
            savingsRate:          { type: 'number', example: 35.99 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth',         description: 'Authentication & user profile' },
      { name: 'Users',        description: 'User management (Admin only)' },
      { name: 'Transactions', description: 'Financial transaction CRUD' },
      { name: 'Categories',   description: 'Transaction categories' },
      { name: 'Analytics',    description: 'Dashboard analytics & aggregations' },
    ],
  },

  apis: [
    path.join(__dirname, 'schemas/*.yaml'),
    path.join(__dirname, '../modules/**/*.routes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
