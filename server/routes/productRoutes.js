import express from 'express';
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  updateQuantity,
  removeProduct,
} from '../controllers/productControllers.js';

//Creating routes for products
const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getOneProduct);
router.put('/:id', updateProduct);
router.put('/quantity/:id', updateQuantity);
router.delete('/:id', removeProduct);

export default router;
