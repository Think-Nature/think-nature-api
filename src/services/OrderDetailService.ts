import { OrderDetailAttributes, OrderDetailCreationAttributes } from '../models/OrderDetail';
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

  async createOrderDetail(OrderDetail: OrderDetailCreationAttributes) {
    return this.OrderDetailRepository.bulkCreate([OrderDetail]);
  }

  async updateOneOrderDetailById(id: number, attrs: OrderDetailAttributes) {
    return this.OrderDetailRepository.updateWithFilters(attrs, { id });
  }

  async deleteOneOrderDetailById(id: number) {
    return this.OrderDetailRepository.deleteWithFilters({ id });
  }
}
