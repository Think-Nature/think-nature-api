import express from 'express';

import OrderController from '../controllers/OrderController';
import Container from '../utils/container';

export default () => {
  const OrderRouter = express.Router();
  const OrderController: OrderController = Container.getInstance().get('OrderController');

  OrderRouter.get('/', (_, res) => OrderController.getAllOrders(res));
  OrderRouter.get('/:id', (req, res) => OrderController.getOneOrderById(req, res));
  OrderRouter.put('/:id', (req, res) => OrderController.updateOneOrderById(req, res));
  OrderRouter.post('/', (req, res) => OrderController.createOrder(req, res));
  OrderRouter.delete('/:id', (req, res) => OrderController.deleteOneOrderById(req, res));
  return OrderRouter;
};
