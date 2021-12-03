import { ModelStatic, ModelAttributes } from '../types';

interface Filter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default class BaseRepository {
  protected model: ModelStatic;

  constructor(model: ModelStatic) {
    this.model = model;
  }

  async getAll() {
    return this.model.findAll();
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

  async bulkCreate(data: ModelAttributes[]) {
    return this.model.bulkCreate(data);
  }

  async createOne(data: ModelAttributes) {
    return this.model.create(data);
  }

  async updateWithFilters(newValue: ModelAttributes, filter: Filter) {
    return this.model.update(newValue, { where: filter, returning: true });
  }

  async deleteWithFilters(filter: Filter) {
    return this.model.destroy({ where: filter });
  }
}
