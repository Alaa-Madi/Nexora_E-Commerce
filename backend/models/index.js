const Category = require('./category');
const Product = require('./product');
const ProductImage = require('./productImage');

// Associations
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { Category, Product, ProductImage };


