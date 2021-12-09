import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

export default class ProductController {
  private ProductService: ProductService;

  constructor(ProductService: ProductService) {
    this.ProductService = ProductService;
  }

  async getAllProducts(res: Response) {
    const Products = (await this.ProductService.getAllProducts()) || [];
    res.json(Products);
  }

  async getOneProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const Product = (await this.ProductService.getOneProductById(id))[0];

      res.json(Product);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const Product = (await this.ProductService.createProduct(req.body))[0];
      res.status(201);
      res.json(Product);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async updateOneProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Sequelize returns the number of updates and the list of updated rows
      // We only want 1 updated row (since id is unique), hence the indexing [1][0]
      const Product = (await this.ProductService.updateOneProductById(id, req.body))[1][0];

      res.json(Product);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }

  async deleteOneProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const numberOfDeletedRows = await this.ProductService.deleteOneProductById(id);

      res.json(numberOfDeletedRows);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  }
}
