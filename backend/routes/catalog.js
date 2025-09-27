const express = require('express');
const router = express.Router();
const { createCategory, listCategories, createProduct, listProducts, updateProduct, deleteProduct, deleteCategory } = require('../controllers/catalogController');

// Categories
router.get('/categories', listCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// Products
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;


