const Category = require('./category');
const Product = require('./product');
const ProductImage = require('./productImage');
const Order = require('./order');
const OrderItem = require('./orderItem');

// Associations
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// Orders
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = { Category, Product, ProductImage, Order, OrderItem };


