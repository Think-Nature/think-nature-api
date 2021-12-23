import { Request, Response } from 'express';
import sequelize from '../db';
import User from '../models/User';
import Order from '../models/Order';
import OrderDetailService from '../services/OrderDetailService';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';
import OrderDetail from '../models/OrderDetail';
import ProductService from '../services/ProductService';
import Product from '../models/Product';

export default class OrderController {
  private OrderService: OrderService;
  private UserService: UserService;
  private OrderDetailService: OrderDetailService;
  private ProductService: ProductService;

  constructor(
    OrderService: OrderService,
    UserService: UserService,
    OrderDetailService: OrderDetailService,
    ProductService: ProductService,
  ) {
    this.OrderService = OrderService;
    this.UserService = UserService;
    this.OrderDetailService = OrderDetailService;
    this.ProductService = ProductService;
  }

  async getOrderProducts(order: Order) {
    const orderDetails = (await this.OrderDetailService.getOrderDetails(order.id)) as unknown as OrderDetail[];
    const orderDetailProductQuantities: number[] = [];
    const orderDetailProductIds = orderDetails.map((orderDetail) => {
      orderDetailProductQuantities[orderDetail.productId] = orderDetail.productQuantity;
      return orderDetail.productId;
    });

    const products = (await this.ProductService.getProductsByIds(orderDetailProductIds)) as unknown as Product[];

    return products.map((product) => {
      return { ...product.toJSON(), productQuantity: orderDetailProductQuantities[product.id] };
    });
  }

  async getAllOrders(res: Response) {
    const Orders = ((await this.OrderService.getAllOrders()) || []) as unknown as Order[];
    const ordersWithProducts = await Promise.all(
      Orders.map(async (order) => {
        const orderProducts = await this.getOrderProducts(order);
        return { ...order.toJSON(), products: orderProducts };
      }),
    );
    res.json(ordersWithProducts);
  }

  async getOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const Order = (await this.OrderService.getOneOrderById(id))[0] as unknown as Order;
      const products = await this.getOrderProducts(Order);

      res.json({ ...Order.toJSON(), products });
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async createOrder(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      // create new user if user with the email does not exist
      const User = ((await this.UserService.getOneUserByEmail(req.body.user.email))?.[0] ??
        (await this.UserService.createUser(req.body.user, { transaction: t }))[0]) as unknown as User;
      const Order = (
        await this.OrderService.createOrder({ ...req.body.order, userId: User.id }, { transaction: t })
      )[0] as unknown as Order;
      await this.OrderDetailService.createOrderDetails(
        req.body.products.map((product: any) => {
          return { ...product, orderId: Order.id };
        }),
        { transaction: t },
      );
      await t.commit();
      const products = await this.getOrderProducts(Order);
      res.status(201);
      res.json({ ...Order.toJSON(), products });
    } catch (e) {
      await t.rollback();
      const { message } = e as Error;
      res.status(400);
      res.json({ message: message });
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
