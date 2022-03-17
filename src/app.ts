import express, { Application } from 'express';

import sequelize from './db';
import models, { Order, Product, OrderDetail } from './models';

import UserController from './controllers/UserController';
import UserRepository from './repositories/UserRepository';
import UserRouter from './routes/UserRoutes';
import UserService from './services/UserService';

import ProductController from './controllers/ProductController';
import ProductRepository from './repositories/ProductRepository';
import ProductRouter from './routes/ProductRoutes';
import ProductService from './services/ProductService';

import OrderController from './controllers/OrderController';
import OrderRepository from './repositories/OrderRepository';
import OrderRouter from './routes/OrderRoutes';
import OrderService from './services/OrderService';

import Container from './utils/container';
import OrderDetailRepository from './repositories/OrderDetailRepository';
import OrderDetailService from './services/orderDetailService';

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
  }

  public initMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
      next();
    });
  }

  public initModels() {
    Object.keys(models).forEach((key) => {
      models[key].initModel(Container.getInstance().get('db'));
    });

    Order.hasMany(OrderDetail, { foreignKey: 'orderId', foreignKeyConstraint: true });
    OrderDetail.belongsTo(Product, { foreignKey: 'productId', foreignKeyConstraint: true });
  }

  public initControllers() {
    this.app.use('/users', UserRouter());
    this.app.use('/products', ProductRouter());
    this.app.use('/orders', OrderRouter());
  }

  public async initContainer() {
    const container = Container.getInstance();
    container.register('db', sequelize, []);

    container.register('UserRepository', UserRepository, ['db']);
    container.register('UserService', UserService, ['UserRepository']);
    container.register('UserController', UserController, ['UserService']);

    container.register('ProductRepository', ProductRepository, ['db']);
    container.register('ProductService', ProductService, ['ProductRepository']);
    container.register('ProductController', ProductController, ['ProductService']);

    container.register('OrderRepository', OrderRepository, ['db']);
    container.register('OrderService', OrderService, ['OrderRepository']);
    container.register('OrderController', OrderController, ['OrderService', 'OrderDetailService', 'ProductService']);

    container.register('OrderDetailRepository', OrderDetailRepository, ['db']);
    container.register('OrderDetailService', OrderDetailService, ['OrderDetailRepository']);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}
