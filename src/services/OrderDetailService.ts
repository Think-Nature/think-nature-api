import { OrderDetailAttributes, OrderDetailCreationAttributes } from '../models/OrderDetail';
import { transactionOptions } from '../repositories/BaseRepository';
import OrderDetailRepository from '../repositories/OrderDetailRepository';

export default class OrderDetailService {
  private OrderDetailRepository: OrderDetailRepository;

  constructor(OrderDetailRepository: OrderDetailRepository) {
    this.OrderDetailRepository = OrderDetailRepository;
  }

  async getAllOrderDetails() {
    return this.OrderDetailRepository.getAll();
  }

  async getOneOrderDetailById(id: number) {
    return this.OrderDetailRepository.getWithFilters({ id });
  }

  async getOrderDetails(orderId: number) {
    return this.OrderDetailRepository.getWithFilters({ orderId });
  }

  async createOrderDetail(OrderDetail: OrderDetailCreationAttributes, options?: transactionOptions) {
    return this.OrderDetailRepository.bulkCreate([OrderDetail], options);
  }

  async createOrderDetails(OrderDetails: OrderDetailCreationAttributes[], options?: transactionOptions) {
    return this.OrderDetailRepository.bulkCreate([...OrderDetails], options);
  }

  async updateOneOrderDetailById(id: number, attrs: OrderDetailAttributes) {
    return this.OrderDetailRepository.updateWithFilters(attrs, { id });
  }

  async deleteOneOrderDetailById(id: number) {
    return this.OrderDetailRepository.deleteWithFilters({ id });
  }
}
