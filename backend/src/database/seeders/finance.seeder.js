'use strict';

const Category = require('../../modules/finance/models/category.model');
const { Transaction } = require('../../modules/finance/models/transaction.model');
const logger = require('../../logs/logger');

/**
 * Seeder for categories and transactions.
 * Creates standard categories (Food, Rent, Salary, etc.)
 * and a batch of transactions for realistic dashboard analytics.
 *
 * @param {object} admin - Created admin user
 * @param {object} viewer - Created viewer user
 */
const seed = async (admin, viewer) => {
  try {
    // 1. Create standard categories
    const categoriesData = [
      { name: 'Salary',    type: 'income',  color: '#10B981', icon: 'cash-outline' },
      { name: 'Investment',type: 'income',  color: '#3B82F6', icon: 'trending-up-outline' },
      { name: 'Housing',   type: 'expense', color: '#EF4444', icon: 'home-outline' },
      { name: 'Food',      type: 'expense', color: '#F59E0B', icon: 'restaurant-outline' },
      { name: 'Transport', type: 'expense', color: '#6366F1', icon: 'bus-outline' },
      { name: 'Utilities', type: 'expense', color: '#8B5CF6', icon: 'flash-outline' },
      { name: 'Shopping',  type: 'expense', color: '#EC4899', icon: 'cart-outline' },
      { name: 'Entertainment', type: 'expense', color: '#F43F5E', icon: 'game-controller-outline' },
    ];

    const categories = await Category.insertMany(
      categoriesData.map(c => ({ ...c, createdBy: admin._id }))
    );
    logger.info('Categories seeded.');

    // 2. Create sample transactions for the last 6 months
    const transactions = [];
    const now = new Date();

    const catMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

      // Monthly Salary
      transactions.push({
        title:     `Salary - ${monthDate.toLocaleString('default', { month: 'long' })}`,
        amount:    5000,
        type:      'income',
        status:    'completed',
        date:      new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
        category:  catMap['Salary'],
        createdBy: admin._id,
      });

      // Monthly Rent
      transactions.push({
        title:     `Rent - ${monthDate.toLocaleString('default', { month: 'long' })}`,
        amount:    1500,
        type:      'expense',
        status:    'completed',
        date:      new Date(monthDate.getFullYear(), monthDate.getMonth(), 5),
        category:  catMap['Housing'],
        createdBy: admin._id,
      });

      // Random daily expenses
      for (let day = 10; day < 28; day += 3) {
        transactions.push({
          title:     `Grocery #${day}`,
          amount:    Math.floor(Math.random() * 150) + 20,
          type:      'expense',
          status:    'completed',
          date:      new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
          category:  catMap['Food'],
          createdBy: viewer._id,
        });
      }
    }

    await Transaction.insertMany(transactions);
    logger.info(`Seeded ${transactions.length} transactions.`);

  } catch (error) {
    logger.error('Failed to seed finance data:', error);
    throw error;
  }
};

module.exports = { seed };
