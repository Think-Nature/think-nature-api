import { Request, Response } from 'express';
import OrderService from '../services/OrderService';

export default class OrderController {
  private OrderService: OrderService;

  constructor(OrderService: OrderService) {
    this.OrderService = OrderService;
  }

  async getAllOrders(res: Response) {
    const Orders = (await this.OrderService.getAllOrders()) || [];
    res.json(Orders);
  }

  async getOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const Order = (await this.OrderService.getOneOrderById(id))[0];

      res.json(Order);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const Order = (await this.OrderService.createOrder(req.body))[0];
      res.status(201);
      res.json(Order);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async updateOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Sequelize returns the number of updates and the list of updated rows
      // We only want 1 updated row (since id is unique), hence the indexing [1][0]
      const Order = (await this.OrderService.updateOneOrderById(id, req.body))[1][0];

      res.json(Order);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async deleteOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const numberOfDeletedRows = await this.OrderService.deleteOneOrderById(id);

      res.json(numberOfDeletedRows);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }
}
