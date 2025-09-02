const { Category, Product, ProductImage } = require('../models');

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listCategories = async (_req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

const createProduct = async (req, res) => {
  try {
    const { title, slug, description, price, sku, stock, category_id, images } = req.body;
    const product = await Product.create({ title, slug, description, price, sku, stock, category_id, created_at: new Date() });
    if (Array.isArray(images) && images.length > 0) {
      const records = images.map((url) => ({ product_id: product.id, url }));
      await ProductImage.bulkCreate(records);
    }
    const withRelations = await Product.findByPk(product.id, { include: [{ model: ProductImage, as: 'images' }, Category] });
    res.status(201).json(withRelations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listProducts = async (_req, res) => {
  const products = await Product.findAll({ include: [{ model: ProductImage, as: 'images' }, Category] });
  res.json(products);
};

module.exports = { createCategory, listCategories, createProduct, listProducts };


