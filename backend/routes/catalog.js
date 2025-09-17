const express = require('express');
const router = express.Router();
const { createCategory, listCategories, createProduct, listProducts, updateProduct, deleteProduct } = require('../controllers/catalogController');

// Categories
router.get('/categories', listCategories);
router.post('/categories', createCategory);

// Products
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;


