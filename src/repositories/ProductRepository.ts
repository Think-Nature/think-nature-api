import { Sequelize } from 'sequelize/types';

import Product from '../models/Product';
import { ModelStatic } from '../types';
import BaseRepository from './BaseRepository';

export default class ProductRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Product.name] as ModelStatic);
  }
}
