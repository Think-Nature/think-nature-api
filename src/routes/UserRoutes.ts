import express from 'express';

import UserController from '../controllers/UserController';
import Container from '../utils/container';

export default () => {
  const userRouter = express.Router();
  const userController: UserController = Container.getInstance().get('UserController');

  userRouter.get('/', (_, res) => userController.getAllUsers(res));
  userRouter.get('/:id', (req, res) => userController.getOneUserById(req, res));
  userRouter.put('/:id', (req, res) => userController.updateOneUserById(req, res));
  userRouter.post('/', (req, res) => userController.createUser(req, res));
  userRouter.delete('/:id', (req, res) => userController.deleteOneUserById(req, res));
  return userRouter;
};
