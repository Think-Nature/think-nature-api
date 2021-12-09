import express, { Application } from 'express';

import sequelize from './db';
import models from './models';

import UserController from './controllers/UserController';
import UserRepository from './repositories/UserRepository';
import UserRouter from './routes/UserRoutes';
import UserService from './services/UserService';

import ProductController from './controllers/ProductController';
import ProductRepository from './repositories/ProductRepository';
import ProductRouter from './routes/ProductRoutes';
import ProductService from './services/ProductService';

import Container from './utils/container';

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
  }

  public initMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public initModels() {
    Object.keys(models).forEach((key) => {
      models[key].initModel(Container.getInstance().get('db'));
    });
  }

  public initControllers() {
    this.app.use('/users', UserRouter());
    this.app.use('/products', ProductRouter());
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
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}
