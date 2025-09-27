const express = require('express');
const router = express.Router();
const { getSummary, getProductSales, getCategoryProductCounts } = require('../controllers/adminController');

router.get('/stats/summary', getSummary);
router.get('/stats/product-sales', getProductSales);
router.get('/stats/category-products', getCategoryProductCounts);

module.exports = router;


