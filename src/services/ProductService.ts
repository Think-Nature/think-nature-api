import { ProductAttributes, ProductCreationAttributes } from '../models/Product';
import ProductRepository from '../repositories/ProductRepository';

export default class ProductService {
  private ProductRepository: ProductRepository;

  constructor(ProductRepository: ProductRepository) {
    this.ProductRepository = ProductRepository;
  }

  async getAllProducts() {
    return this.ProductRepository.getAll();
  }

  async getProductsByIds(productIds: number[], showCost = false) {
    return showCost
      ? this.ProductRepository.getScopeWithFilters({ id: productIds }, 'withCost')
      : this.ProductRepository.getWithFilters({ id: productIds });
  }

  async getOneProductById(id: number, showCost = false) {
    return showCost
      ? this.ProductRepository.getScopeWithFilters({ id }, 'withCost')
      : this.ProductRepository.getWithFilters({ id });
  }

  async createProduct(Product: ProductCreationAttributes) {
    return this.ProductRepository.bulkCreate([Product]);
  }

  async updateOneProductById(id: number, attrs: ProductAttributes) {
    return this.ProductRepository.updateWithFilters(attrs, { id });
  }

  async deleteOneProductById(id: number) {
    return this.ProductRepository.deleteWithFilters({ id });
  }
}
