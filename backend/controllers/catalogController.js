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

const listProducts = async (req, res) => {
  const limit = Math.max(parseInt(req.query.limit, 10) || 0, 0);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const offset = limit > 0 ? (page - 1) * limit : undefined;

  if (limit > 0) {
    const result = await Product.findAndCountAll({
      include: [{ model: ProductImage, as: 'images' }, Category],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    return res.json({ rows: result.rows, count: result.count, page, pageSize: limit });
  }

  const products = await Product.findAll({ include: [{ model: ProductImage, as: 'images' }, Category], order: [["created_at", "DESC"]] });
  res.json({ rows: products, count: products.length, page: 1, pageSize: products.length });
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, price, sku, stock, category_id, images } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({ title, slug, description, price, sku, stock, category_id });
    
    // Update images if provided
    if (Array.isArray(images)) {
      // Delete existing images
      await ProductImage.destroy({ where: { product_id: id } });
      // Add new images
      if (images.length > 0) {
        const records = images.map((url) => ({ product_id: id, url }));
        await ProductImage.bulkCreate(records);
      }
    }

    const withRelations = await Product.findByPk(id, { include: [{ model: ProductImage, as: 'images' }, Category] });
    res.json(withRelations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images first
    await ProductImage.destroy({ where: { product_id: id } });
    
    // Delete the product
    await product.destroy();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createCategory, listCategories, createProduct, listProducts, updateProduct, deleteProduct };


