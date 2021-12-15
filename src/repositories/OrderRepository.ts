import { Sequelize } from 'sequelize/types';

import Order from '../models/Order';
import { ModelStatic } from '../types';
import BaseRepository from './BaseRepository';

export default class OrderRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Order.name] as ModelStatic);
  }
}
