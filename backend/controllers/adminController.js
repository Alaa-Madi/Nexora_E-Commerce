const { Sequelize } = require('sequelize');
const { Category, Product, Order, OrderItem } = require('../models');

// GET /api/admin/stats/summary
exports.getSummary = async (_req, res) => {
  try {
    const [totalProducts, totalCategories, totalOrders, totalRevenue] = await Promise.all([
      Product.count(),
      Category.count(),
      Order.count(),
      Order.sum('total')
    ]);

    return res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue: Number(totalRevenue || 0)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/stats/product-sales
// Note: OrderItem does not reference product_id, so we aggregate by product_title
exports.getProductSales = async (_req, res) => {
  try {
    const rows = await OrderItem.findAll({
      attributes: [
        'product_title',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold']
      ],
      group: ['product_title'],
      // Order by the aggregate directly for portability
      order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
      raw: true
    });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/stats/category-products
exports.getCategoryProductCounts = async (_req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      include: [{ model: Product, attributes: ['id'], required: false, as: 'Products' }],
      order: [['name', 'ASC']],
    });
    
    // Calculate product count for each category
    const rows = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category.Products ? category.Products.length : 0
    }));
    
    return res.json(rows);
  } catch (err) {
    console.error('Category products error:', err);
    return res.status(500).json({ error: err.message });
  }
};


