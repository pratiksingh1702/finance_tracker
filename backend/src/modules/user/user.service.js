'use strict';

const userRepository  = require('./user.repository');
const passwordService = require('../../services/password.service');
const auditService    = require('../../services/audit.service');
const notifService    = require('../../services/notification.service');
const ApiError        = require('../../utils/api-error.util');
const { buildFilter } = require('../../repositories/query-builder/filter.query-builder');
const { buildSort }   = require('../../repositories/query-builder/sort.query-builder');
const { buildPagination } = require('../../repositories/query-builder/pagination.query-builder');

const FILTER_FIELDS  = ['role', 'isActive'];
const SORT_FIELDS    = ['name', 'email', 'role', 'createdAt'];

class UserService {

  async createUser(dto, actor) {
    const exists = await userRepository.findByEmail(dto.email);
    if (exists) {
      throw ApiError.conflict(`Email '${dto.email}' is already in use.`);
    }

    const hashed = await passwordService.hash(dto.password);
    const user   = await userRepository.create({
      ...dto,
      password:  hashed,
      createdBy: actor?.id ?? null,
    });

    await notifService.sendWelcome(user);
    auditService.log({ action: 'CREATE_USER', resource: 'User', resourceId: user._id, actor, after: user });

    // Never return the password hash
    const { password: _pw, ...safeUser } = user.toObject ? user.toObject() : user;
    return safeUser;
  }

  async listUsers(query) {
    const { page, limit, skip } = buildPagination(query);
    const filter  = buildFilter(query, FILTER_FIELDS);
    const sort    = buildSort(query, SORT_FIELDS);

    const [data, total] = await Promise.all([
      userRepository.findAllActive({ filter, sort, skip, limit }),
      userRepository.countActive(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user || user.deletedAt) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }

  async updateUser(id, dto, actor) {
    const existing = await this.getUserById(id);

    const updated = await userRepository.updateById(id, {
      ...dto,
      updatedBy: actor?.id ?? null,
    });

    auditService.log({
      action:     'UPDATE_USER',
      resource:   'User',
      resourceId: id,
      actor,
      before:     existing,
      after:      updated,
    });

    return updated;
  }

  async assignRole(id, role, actor) {
    const user = await this.getUserById(id);

    if (user.role === role) {
      throw ApiError.conflict(`User already has the role '${role}'.`);
    }

    const updated = await userRepository.updateById(id, {
      role,
      updatedBy: actor?.id ?? null,
    });

    auditService.log({
      action:     'ASSIGN_ROLE',
      resource:   'User',
      resourceId: id,
      actor,
      before:     { role: user.role },
      after:      { role },
    });

    return updated;
  }

  async deactivateUser(id, actor) {
    const user = await this.getUserById(id);
    if (!user.isActive) {
      throw ApiError.conflict('User is already inactive.');
    }

    const updated = await userRepository.updateById(id, {
      isActive:  false,
      updatedBy: actor?.id ?? null,
    });

    auditService.log({ action: 'DEACTIVATE_USER', resource: 'User', resourceId: id, actor });
    return updated;
  }

  async deleteUser(id, actor) {
    await this.getUserById(id); // ensure exists
    const deleted = await userRepository.softDelete(id, actor?.id ?? null);

    auditService.log({ action: 'DELETE_USER', resource: 'User', resourceId: id, actor });
    return deleted;
  }
}

module.exports = new UserService();
