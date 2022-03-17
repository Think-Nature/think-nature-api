import { IncludeOptions, Transaction, WhereOptions } from 'sequelize/types';
import { ModelStatic, ModelAttributes } from '../types';

interface Filter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TransactionOptions {
  transaction: Transaction;
}

export default class BaseRepository {
  protected model: ModelStatic;

  constructor(model: ModelStatic) {
    this.model = model;
  }

  async getAll(include?: IncludeOptions | IncludeOptions[], where?: WhereOptions) {
    return this.model.findAll({ include, where });
  }

  async getAllWithExclude(exclude: string[]) {
    return this.model.findAll({ attributes: { exclude } });
  }

  async getWithFilters(filter: Filter) {
    return this.model.findAll({ where: filter });
  }

  async getScopeWithFilters(filter: Filter, scope: string) {
    return this.model.scope(scope).findAll({ where: filter });
  }

  async bulkCreate(data: ModelAttributes[], options?: TransactionOptions) {
    return this.model.bulkCreate([...data], { ...options });
  }

  async createOne(data: ModelAttributes, options?: TransactionOptions) {
    return this.model.create(data, { ...options });
  }

  async updateWithFilters(newValue: ModelAttributes, filter: Filter) {
    return this.model.update(newValue, { where: filter, returning: true });
  }

  async deleteWithFilters(filter: Filter) {
    return this.model.destroy({ where: filter });
  }
}
