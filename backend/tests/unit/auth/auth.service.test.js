'use strict';

const authService = require('../../../src/modules/auth/auth.service');
const userRepository = require('../../../src/modules/user/user.repository');
const tokenService = require('../../../src/services/token.service');
const passwordService = require('../../../src/services/password.service');
const { adminUser, password } = require('../../fixtures/user.fixture');

jest.mock('../../../src/modules/user/user.repository');
jest.mock('../../../src/modules/auth/auth.repository');
jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/password.service');
jest.mock('../../../src/services/audit.service');
jest.mock('../../../src/modules/auth/strategies/local.strategy');

const { localStrategy } = require('../../../src/modules/auth/strategies/local.strategy');
const authRepository = require('../../../src/modules/auth/auth.repository');
const auditService = require('../../../src/services/audit.service');

describe('Auth Service', () => {
  describe('login', () => {
    test('should return user and tokens when login is successful', async () => {
      localStrategy.mockResolvedValue(adminUser);
      authRepository.recordLogin.mockResolvedValue();
      auditService.log.mockReturnValue();
      tokenService.generateTokenPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: '1h',
      });

      const result = await authService.login(adminUser.email, password);

      expect(result.user.email).toBe(adminUser.email);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    test('should throw error when login fails', async () => {
      localStrategy.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(adminUser.email, password)).rejects.toThrow('Invalid credentials');
    });
  });
});
