import { Sequelize } from 'sequelize/types';

import OrderDetail from '../models/OrderDetail';
import { ModelStatic } from '../types';
import BaseRepository from './BaseRepository';

export default class OrderDetailRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[OrderDetail.name] as ModelStatic);
  }
}
