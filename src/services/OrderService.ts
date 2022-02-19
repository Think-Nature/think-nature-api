import { OrderAttributes, OrderCreationAttributes } from '../models/Order';
import { TransactionOptions } from '../repositories/BaseRepository';
import OrderRepository from '../repositories/OrderRepository';

export default class OrderService {
  private OrderRepository: OrderRepository;

  constructor(OrderRepository: OrderRepository) {
    this.OrderRepository = OrderRepository;
  }

  async getAllOrders() {
    return this.OrderRepository.getAll();
  }

  async getOneOrderById(id: number) {
    return this.OrderRepository.getWithFilters({ id });
  }

  async createOrder(Order: OrderCreationAttributes, options: TransactionOptions) {
    return this.OrderRepository.createOne(Order, { ...options });
  }

  async updateOneOrderById(id: number, attrs: OrderAttributes) {
    return this.OrderRepository.updateWithFilters(attrs, { id });
  }

  async deleteOneOrderById(id: number) {
    return this.OrderRepository.deleteWithFilters({ id });
  }
}
