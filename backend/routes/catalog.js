const express = require('express');
const router = express.Router();
const { createCategory, listCategories, createProduct, listProducts } = require('../controllers/catalogController');

// Categories
router.get('/categories', listCategories);
router.post('/categories', createCategory);

// Products
router.get('/products', listProducts);
router.post('/products', createProduct);

module.exports = router;


