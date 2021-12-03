import express, { Application } from 'express';

import sequelize from './db';
import models from './models';

import UserController from './controllers/UserController';
import UserRepository from './repositories/UserRepository';
import UserRouter from './routes/UserRoutes';
import UserService from './services/UserService';

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
  }

  public async initContainer() {
    const container = Container.getInstance();
    container.register('db', sequelize, []);

    container.register('UserRepository', UserRepository, ['db']);
    container.register('UserService', UserService, ['UserRepository']);
    container.register('UserController', UserController, ['UserService']);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}
