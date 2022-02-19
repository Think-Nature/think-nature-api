import { Request, Response } from 'express';
import sequelize from '../db';
import Order from '../models';
import OrderDetail, { OrderDetailCreationAttributes } from '../models/orderDetail';
import orderDetailService from '../services/orderDetailService';
import orderService from '../services/orderService';
import ProductService from '../services/ProductService';

export default class orderController {
  private orderService: orderService;
  private orderDetailService: orderDetailService;
  private productService: ProductService;

  constructor(orderService: orderService, orderDetailService: orderDetailService, productService: ProductService) {
    this.orderService = orderService;
    this.orderDetailService = orderDetailService;
    this.productService = productService;
  }

  // Get the product details from order details
  private async getProductDetails(orderDetails: OrderDetail[]) {
    const productDetails = [];

    for (const orderDetail of orderDetails) {
      const productDetail = await this.productService.getOneProductById(orderDetail.productId);
      productDetails.push(productDetail);
    }
    return productDetails;
  }

  async getAllOrders(res: Response) {
    const orders = (await this.orderService.getAllOrders()) || [];
    res.json(orders);
  }

  async getOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const order = (await this.orderService.getOneOrderById(id))[0];

      const orderDetails = (await this.orderDetailService.getOrderDetailsByOrderId(id)) as unknown as OrderDetail[];

      const productDetails = await this.getProductDetails(orderDetails);

      res.json({ order, products: productDetails });
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      await sequelize.transaction(async (t) => {
        const order = (await this.orderService.createOrder(req.body, {
          transaction: t,
        })) as unknown as typeof Order;

        let products = req.body.products || [];

        // TODO: Create util for creating error objects
        if (products.length == 0) {
          throw { message: 'Cannot have an order with no products!' };
        }

        products = products.map((p: Omit<OrderDetailCreationAttributes, 'orderId'>) => {
          return { ...p, orderId: order.id };
        });

        const orderDetails = (await this.orderDetailService.createOrderDetails(products, {
          transaction: t,
        })) as unknown as OrderDetail[];

        const productDetails = await this.getProductDetails(orderDetails);

        res.status(201);
        res.json({ order, products: productDetails });
      });
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
      const order = (await this.orderService.updateOneOrderById(id, req.body))[1][0];

      res.json(order);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  // TODO: When deleting order, delete all associated orderDetails
  async deleteOneOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const numberOfDeletedRows = await this.orderService.deleteOneOrderById(id);

      res.json(numberOfDeletedRows);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }
}
