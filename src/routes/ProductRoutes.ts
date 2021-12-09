import express from 'express';

import ProductController from '../controllers/ProductController';
import Container from '../utils/container';

export default () => {
  const ProductRouter = express.Router();
  const ProductController: ProductController = Container.getInstance().get('ProductController');

  ProductRouter.get('/', (_, res) => ProductController.getAllProducts(res));
  ProductRouter.get('/:id', (req, res) => ProductController.getOneProductById(req, res));
  ProductRouter.put('/:id', (req, res) => ProductController.updateOneProductById(req, res));
  ProductRouter.post('/', (req, res) => ProductController.createProduct(req, res));
  ProductRouter.delete('/:id', (req, res) => ProductController.deleteOneProductById(req, res));
  return ProductRouter;
};
